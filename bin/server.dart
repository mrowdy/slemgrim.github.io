import 'dart:io';

import 'package:route/server.dart';
import 'package:mailer/mailer.dart';


final homeUrl = new UrlPattern(r'/');
final contactUrl = new UrlPattern(r'/contact');
final allUrls = [homeUrl, contactUrl];

final receiver = 'contact@ritberger.at';
bool error = false;

var options = new GmailSmtpOptions()
  ..username = ''
  ..password = '';

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
    error = false;
    queryParams = _validateMessages(queryParams);

    if(!error){
        _sendMessage(queryParams['email'], queryParams['name'], queryParams['message']);
    }

    req.response.close();
}

Map _validateMessages(Map params){

    if(!params.containsKey('email') || params['email'].length == 0){
        error = true;
    } else {
        error = !isEmail(params['email']);
    }

    if(!params.containsKey('name') || params['name'].length == 0){
        error = true;
    }

    if(!params.containsKey('message') || params['message'].length == 0){
        error = true;
    }

    return params;
}

void _sendMessage(String email, String name, String message){
    // Create our email transport.
    var emailTransport = new SmtpTransport(options);

    // Create our mail/envelope.
    var envelope = new Envelope()
      ..from = 'contact@slemgrim.com'
      ..recipients.add('contact@slemgrim.com')
      ..subject = 'New Slemgrim.com contact mail'
      ..text = _buildBody(name, email, message);

    // Email it.
    emailTransport.send(envelope)
      .then((success) => print('Email sent! $success'))
      .catchError((e) => print('Error occured: $e'));

}

bool isEmail(String em) {
    String p = r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$';
    RegExp regExp = new RegExp(p);
    return regExp.hasMatch(em);
}

String _buildBody(String email, String name, String message){
        return """New Slemgrim.com contact mail

Name: ${name}
Mail: ${email}

Message:

${message} 
    """;
}