import 'dart:io';
import 'dart:convert' show UTF8, JSON;
import 'dart:async';

import '../packages/route/server.dart';

final homeUrl = new UrlPattern(r'/');
final contactUrl = new UrlPattern(r'/contact');
final allUrls = [homeUrl, contactUrl];

final receiver = 'contact@ritberger.at';
bool error = false;


void main() {
    HttpServer.bind(InternetAddress.LOOPBACK_IP_V4, 4041)
        .then(_listenForRequests)
        .catchError((e) => print (e.toString()));
}

void _listenForRequests(HttpServer _server) {
    new Router(_server)
        ..serve(contactUrl, method: 'GET').listen(_serveContact);
}


void _serveContact(HttpRequest req) {
    Map queryParams = req.uri.queryParameters;
    _filterMessages(queryParams);
    error = false;
    if(!error){
        _sendMessage(queryParams['email'], queryParams['name'], queryParams['message']);
    }

    req.response.close();
}

Map _filterMessages(Map params){

    return params;
}

void _sendMessage(String email, String name, String message){
    print(email);
    print(name);
    print(message);
}