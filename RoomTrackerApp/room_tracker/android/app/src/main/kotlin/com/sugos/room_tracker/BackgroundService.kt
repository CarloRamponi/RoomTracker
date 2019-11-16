package com.sugos.room_tracker

import io.flutter.plugin.common.MethodChannel
import io.flutter.view.FlutterView
import android.os.Bundle
import com.estimote.proximity_sdk.api.EstimoteCloudCredentials
import com.estimote.mustard.rx_goodness.rx_requirements_wizard.RequirementsWizardFactory
import android.util.Log
import com.estimote.proximity_sdk.api.ProximityObserver
import com.estimote.proximity_sdk.api.ProximityZoneContext
import com.estimote.proximity_sdk.api.ProximityZoneBuilder
import com.estimote.proximity_sdk.api.ProximityObserverBuilder
import com.estimote.proximity_sdk.api.ProximityZone
import android.content.Context
import android.content.ContentValues.TAG
import io.flutter.plugin.common.EventChannel
import java.util.*
import java.util.stream.IntStream
import java.util.stream.Stream


class BackgroundService(mainActivity: MainActivity, flutterView: FlutterView) {

    private val CHANNEL = "com.sugos.room_tracker/background_service"
    private val STREAM = "com.sugos.room_tracker/background_service_stream"
    var bestia = ""
    var eventSink : EventChannel.EventSink? = null

    init {

        Log.d("TestPra", "Ciao fraaa")

        val cloudCredentials = EstimoteCloudCredentials(
                "room-tracker-hf2",
                "f4239a51400d6ad9e7649ea4070c926e")

        /*val notification = Notification.Builder(this)
                .setSmallIcon(R.drawable.notification_icon_background)
                .setContentTitle("Beacon scan")
                .setContentText("Scan is running...")
                .setPriority(Notification.PRIORITY_HIGH)
                .build()*/

        val proximityObserver = ProximityObserverBuilder(mainActivity.applicationContext, cloudCredentials)
                .onError { throwable ->
                    Log.e("app", "proximity observer error: $throwable")
                    null
                }
                //.withScannerInForegroundService(notification)
                .withLowLatencyPowerMode()
                .withEstimoteSecureMonitoringDisabled()
                .withTelemetryReportingDisabled()
                .build()

        var tags = listOf<String>("bianco", "verde", "azzurro", "viola")
        val zones = mutableListOf<ProximityZone>()

        for( tag in tags){

            zones.add(
                    ProximityZoneBuilder()
                            .forTag(tag)
                            .inNearRange()
                            .onEnter { proximityContext ->
                                val name = proximityContext.attachments["name"]
                                Log.d("TestPra", "On enter " + tag + " - " + name)
                                bestia = tag + " - "+ name
                                eventSink?.success("1"+name)
                                null
                            }
                            .onExit { proximityContext ->
                                val name = proximityContext.attachments["name"]
                                Log.d("TestPra", "On exit " + tag + " - " + name)
                                bestia = ""
                                eventSink?.success("0"+name)
                                null
                            }
                            .build()
            )

        }

        RequirementsWizardFactory.createEstimoteRequirementsWizard().fulfillRequirements(
                mainActivity,
                onRequirementsFulfilled = {

                    proximityObserver.startObserving(zones);
                },
                onRequirementsMissing = { Log.d("room_tracker", "Unable to start scan. Requirements not fulfilled: ${it.joinToString()}") },
                onError = { Log.d("room_tracker", "Error while checking requirements: ${it.message}") })

        MethodChannel(flutterView, CHANNEL).setMethodCallHandler { call, result ->
            if (call.method == "getCurrentRoom") {
                val currentRoom = getCurrentRoom()

                if (currentRoom != "") {
                    result.success(currentRoom)
                } else {
                    result.error("UNAVAILABLE", "Current room not available.", null)
                }
            } else {
                result.notImplemented()
            }
        }

        EventChannel(flutterView, STREAM).setStreamHandler(
                object : EventChannel.StreamHandler {
                    override fun onListen(args: Any?, events: EventChannel.EventSink) {
                        Log.w(TAG, "adding listener")
                        eventSink = events
                        eventSink?.success(bestia)
                    }

                    override fun onCancel(args: Any?) {
                        Log.w(TAG, "cancelling listener")
                        eventSink = null
                    }
                }
        )

    }

    fun getCurrentRoom(): String {
        return bestia
    }

}