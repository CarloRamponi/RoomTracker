import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:charts_flutter/flutter.dart' as charts;

class HomePage extends StatefulWidget {

  HomePage({Key key, this.uid}) : super(key: key);
  //update the constructor to include the uid
  final String uid; //include this

  @override
  _HomePageState createState() => _HomePageState();

}

class RoomStats {
  final String name;
  final int minutes;

  RoomStats(this.name, this.minutes);
}

class _HomePageState extends State<HomePage> {

  static const channel = const MethodChannel('com.sugos.room_tracker/background_service');
  static const stream = const EventChannel('com.sugos.room_tracker/background_service_stream');

  final HttpsCallable entryFunc = CloudFunctions.instance.getHttpsCallable(
    functionName: 'registerEntry',
  );

  final HttpsCallable leaveFunc = CloudFunctions.instance.getHttpsCallable(
    functionName: 'registerLeave',
  );

  String _name;
  String _title = "General stats";
  int _pageCounter = 0;

  StreamSubscription _streamSubscription;

  Map<String, charts.Color> colors = {
    'atrio' : charts.Color(r: 255, g: 111, b: 0),
    'expo' : charts.Color(r: 76, g: 175, b: 80),
    'carroponte' : charts.Color(r: 33, g: 150, b: 243),
    'palco' : charts.Color(r: 236, g: 64, b: 122)
  };

  Future<List<charts.Series<RoomStats, String>>> _processDailyStats() async {
    QuerySnapshot query = await Firestore.instance.collection('data').where('uid', isEqualTo: widget.uid).where('tsin', isGreaterThan: DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day)).getDocuments();
    Map<String, int> sums = new Map();
    query.documents.forEach((doc) {
      if(doc.data['tsout'] != null) {
        int minutes = doc.data['tsout']
            .toDate()
            .difference(doc.data['tsin'].toDate())
            .inMinutes; //TODO: mettere inMinutes
        sums[doc.data['room']] = sums[doc.data['room']] == null ? minutes : sums[doc.data['room']] + minutes;
      }
    });

    List<RoomStats> list = new List();
    sums.forEach((room, time) {
      list.add(RoomStats(room, time));
    });

    return [
      new charts.Series<RoomStats, String>(
        id: 'Sales',
        domainFn: (RoomStats sales, _) => sales.name,
        measureFn: (RoomStats sales, _) => sales.minutes / 60,
        colorFn: (RoomStats sales, _) => colors[sales.name],
        //labelAccessorFn: (RoomStats sales, _) => sales.name,
        data: list,
      )
    ];
  }

  //This chart is ard coded because of the lack of time
  static List<charts.Series<RoomStats, String>> _processWeekDayStats() {
    final atrio = [
      new RoomStats('Mon', 180),
      new RoomStats('Tue', 120),
      new RoomStats('Wed', 240),
      new RoomStats('Thu', 180),
      new RoomStats('Fri', 60),
    ];

    final expo = [
      new RoomStats('Mon', 240),
      new RoomStats('Tue', 300),
      new RoomStats('Wed', 240),
      new RoomStats('Thu', 360),
      new RoomStats('Fri', 180),

    ];

    final carroponte = [
      new RoomStats('Mon', 120),
      new RoomStats('Tue', 180),
      new RoomStats('Wed', 60),
      new RoomStats('Thu', 240),
      new RoomStats('Fri', 300),
    ];

    final palco = [
      new RoomStats('Mon', 60),
      new RoomStats('Tue', 180),
      new RoomStats('Wed', 60),
      new RoomStats('Thu', 180),
      new RoomStats('Fri', 120),
    ];

    return [
      new charts.Series<RoomStats, String>(
        id: 'atrio',
        domainFn: (RoomStats sales, _) => sales.name,
        measureFn: (RoomStats sales, _) => sales.minutes / 60,
        data: atrio,
      ),
      new charts.Series<RoomStats, String>(
        id: 'expo',
        domainFn: (RoomStats sales, _) => sales.name,
        measureFn: (RoomStats sales, _) => sales.minutes / 60,
        data: expo,
      ),
      new charts.Series<RoomStats, String>(
        id: 'carroponte',
        domainFn: (RoomStats sales, _) => sales.name,
        measureFn: (RoomStats sales, _) => sales.minutes / 60,
        data: carroponte,
      ),
      new charts.Series<RoomStats, String>(
        id: 'palco',
        domainFn: (RoomStats sales, _) => sales.name,
        measureFn: (RoomStats sales, _) => sales.minutes / 60,
        data: palco,
      ),
    ];
  }

  void _getName() async {
    QuerySnapshot query = await Firestore.instance.collection('users').where('uid', isEqualTo: widget.uid).getDocuments();
    if(query.documents.isNotEmpty) {
      setState(() {
        _name = query.documents[0].data['fname'] + ' ' + query.documents[0].data['surname'];
      });
    } else {
      setState(() {
        _name = 'Harold Finch';
      });
    }
  }

  Future<List<charts.Series<RoomStats, String>>> _processAvgStats() async {
    QuerySnapshot query = await Firestore.instance.collection('data').where('uid', isEqualTo: widget.uid).getDocuments();
    Map<String, int> sums = new Map();
    query.documents.forEach((doc) {
      if(doc.data['tsout'] != null) {
        int minutes = doc.data['tsout']
            .toDate()
            .difference(doc.data['tsin'].toDate())
            .inMinutes;
        sums[doc.data['room']] = sums[doc.data['room']] == null ? minutes : sums[doc.data['room']] + minutes;
      }
    });

    List<RoomStats> list = new List();
    sums.forEach((room, time) {
      list.add(RoomStats(room, time));
    });

    return [
      new charts.Series<RoomStats, String>(
        id: 'Sales',
        domainFn: (RoomStats sales, _) => sales.name,
        measureFn: (RoomStats sales, _) => sales.minutes / 600,
        colorFn: (RoomStats sales, _) => colors[sales.name],
        //labelAccessorFn: (RoomStats sales, _) => sales.name,
        data: list,
      )
    ];
  }

  @override
  void initState() {
    _enableSubscription();
    _getName();
    super.initState();
  }

  void _enableSubscription() {
    if (_streamSubscription == null) {
      _streamSubscription = stream.receiveBroadcastStream().listen(_update);
    }
  }

  void _disableSubscription() {
    if (_streamSubscription != null) {
      _streamSubscription.cancel();
      _streamSubscription = null;
    }
  }

  void _update(evnt) {
    if(evnt != null && evnt != "") {
      String room = evnt.substring(1, evnt.length);
      if (evnt[0] == '0') {

//        setState(() {
//          _room = null;
//        });

        leaveFunc.call(<String, dynamic> {
          'room' : room
        }).then((res) {
          print((res as HttpsCallableResult).data.toString());
        }).catchError((e) {
          print((e as CloudFunctionsException).message);
        });
      } else if (evnt[0] == '1') {

        setState(() {
          _room = room;
        });

        entryFunc.call(<String, dynamic> {
          'room' : room
        }).then((res) {
          print((res as HttpsCallableResult).data.toString());
        }).catchError((e) {
          print((e as CloudFunctionsException).message);
        });
      }
    }
  }

  String _room;

  void callMethod() async {

    String room;

    try {
      room = await channel.invokeMethod('getCurrentRoom');
    } on PlatformException catch (e) {
      print(e.message);
      room = "Unable to get current room";
    }

    setState(() {
      _room = room;
    });
  }
  void setPage(int page) {
    setState(() {

      _pageCounter = page;

      switch(page) {
        case 0:
          _title = "General stats";
          break;
        case 1:
          _title = "Day stats";
          break;
        case 2:
          _title = "Live Position";
          break;
        default:
          print("Wrong page $page");
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
            _title
        ),
      ),
      drawer: Drawer(
        // Add a ListView to the drawer. This ensures the user can scroll
        // through the options in the drawer if there isn't enough vertical
        // space to fit everything.
        child: ListView(
          // Important: Remove any padding from the ListView.
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              child: Container(
                alignment: Alignment.bottomRight,
                padding: EdgeInsets.all(10),
                child: Text(
                  _name ?? "",
                  textAlign: TextAlign.right,
                  style: TextStyle(fontSize: 30, color: Colors.white),
                )
              ),
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
            ),
            ListTile(
              title: Text('General stats'),
              onTap: () {
                setPage(0);
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: Text('By day of the week'),
              onTap: () {
                setPage(1);
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: Text('Live Position'),
              onTap: () {
                setPage(2);
                Navigator.pop(context);
              },
            )
          ],
        ),
      ),
      body: _buildContent()
    );
  }

  Widget _buildContent() {
    switch(_pageCounter) {
      case 0:
        return ListView(
          padding: EdgeInsets.symmetric(vertical: 20),
          children: <Widget>[
            Text(
              "Where did you spend your time today?",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 20),
            ),
            Padding(padding: EdgeInsets.symmetric(vertical: 10),),
            Padding(
              padding: EdgeInsets.all(10),
              child: SizedBox(
                height: 200,
                child: FutureBuilder(
                  future: _processDailyStats(),
                  builder: (context, snapshot) {
                    if(snapshot.hasData) {
                      return charts.BarChart(snapshot.data as List<charts.Series<RoomStats, String>>,
                        animate: true,
                        // Configure the width of the pie slices to 60px. The remaining space in
                        // the chart will be left as a hole in the center.
//                          defaultRenderer: new charts.ArcRendererConfig(arcRendererDecorators: [ new charts.ArcLabelDecorator(labelPosition: charts.ArcLabelPosition.outside) ])
                        defaultRenderer: new charts.BarRendererConfig(
                            cornerStrategy: const charts.ConstCornerStrategy(30)),
//                          behaviors: [new charts.DatumLegend()]
                      );
                    } else {
                      return CircularProgressIndicator();
                    }
                  },
                ),
              ),
            ),
            Divider(color: Colors.black,),
            Text(
              "Where do you usually spend your time?",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 20),
            ),
            Padding(padding: EdgeInsets.symmetric(vertical: 10),),
            Padding(
              padding: EdgeInsets.all(10),
              child: SizedBox(
                height: 200,
                child: FutureBuilder(
                  future: _processAvgStats(),
                  builder: (context, snapshot) {
                    if(snapshot.hasData) {
                      return charts.BarChart(snapshot.data as List<charts.Series<RoomStats, String>>,
                        animate: true,
                        // Configure the width of the pie slices to 60px. The remaining space in
                        // the chart will be left as a hole in the center.
//                          defaultRenderer: new charts.ArcRendererConfig(arcRendererDecorators: [ new charts.ArcLabelDecorator(labelPosition: charts.ArcLabelPosition.outside) ])
                        defaultRenderer: new charts.BarRendererConfig(
                            cornerStrategy: const charts.ConstCornerStrategy(30)),
//                          behaviors: [new charts.DatumLegend()]
                      );
                    } else {
                      return CircularProgressIndicator();
                    }
                  },
                ),
              ),
            )
          ],
        );
        break;
      case 1:
        return ListView(
          padding: EdgeInsets.symmetric(vertical: 20),
          children: <Widget>[
            Text(
              "Where are you every day?",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 20),
            ),
            Padding(padding: EdgeInsets.symmetric(vertical: 10),),
            Padding(
              padding: EdgeInsets.all(10),
              child: SizedBox(
                height: 350,
                child: charts.BarChart(
                  _processWeekDayStats(),
                  animate: true,
                  // Configure the width of the pie slices to 60px. The remaining space in
                  // the chart will be left as a hole in the center.
//                          defaultRenderer: new charts.ArcRendererConfig(arcRendererDecorators: [ new charts.ArcLabelDecorator(labelPosition: charts.ArcLabelPosition.outside) ])
//                        defaultRenderer: new charts.BarRendererConfig(
//                            cornerStrategy: const charts.ConstCornerStrategy(30)),
//                          behaviors: [new charts.DatumLegend()]
                  barGroupingType: charts.BarGroupingType.stacked,
                  behaviors: [new charts.SeriesLegend()],
                ),
              ),
            ),
          ],
        );
        break;
      case 2:
        return Center(
          child: Column(
            children: <Widget>[
              Padding(padding: EdgeInsets.symmetric(vertical: 50),),
              Text(
                  "Current room:",
                  style: TextStyle(fontSize: 30),
              ),
              Text(
                _room ?? "...",
                style: TextStyle(fontSize: 50),
              )
            ],
          ),
        );
        break;
      default:
        return Center(child: Text("Unknown page $_pageCounter"));
    }
  }
}