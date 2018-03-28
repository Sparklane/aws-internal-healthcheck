'use strict';

const https = require('https');
const http = require('follow-redirects').http;
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch({apiVersion: '2013-02-22', region: 'eu-west-1'});

var conf = {
    protocol : process.env.PROTOCOL || 'http',
    host: process.env.HOSTNAME || 'localhost',
    port: process.env.PORT || '80',
    path: process.env.URL_PATH || '',
    stringMatching: process.env.STRING_MATCHING,
    invertHealthCheckStatus: process.env.INVERT_HEALTHCHECK_STATUS || false,
    metricName : process.env.METRIC_NAME || 'MyService',
    metricNameSpace : process.env.METRIC_NAMESPACE || 'HealthCheck'
}
var url = `${conf.protocol}://${conf.host}:${conf.port}${conf.path}`

exports.handler = (event, context, callback) => {
    
    console.log(`Checking ${url}`)

    http.get(url, res => {

        if (conf.stringMatching) {
            let body = ''
            res.on('data', chunk => {
                body += chunk
            })
            res.on('end', chunk => {
                if (body.includes(conf.stringMatching)) {
                    ProcessStatus (true, res.statusCode, "string found in body", callback)
                } else {
                    ProcessStatus (false, res.statusCode, new Error(`cannot find string in response: '${conf.stringMatching}'`), callback)
                }
            })
        } else {
            if (res.statusCode >= 200 && res.statusCode < 400 ) {
                ProcessStatus (true, res.statusCode, null, callback)
            } else {
                ProcessStatus (false, res.statusCode, new Error(`${res.statusMessage}`), callback)
            }
        }
    }).on('error', e => {
        ProcessStatus (false, null, e, callback)
    })
};

var ProcessStatus = (statusOK, statusCode, err, cb) => {
    let isOK = conf.invertHealthCheckStatus ? !statusOK: statusOK
    let metrics = {
        MetricData : [
            {
                MetricName: conf.metricName,
                Dimensions: [
                    {
                      Name: 'Url',
                      Value: url 
                    }
                ],
                Value: isOK ? 1: 0
            }
        ],
        Namespace: conf.metricNameSpace,
    }
    cloudwatch.putMetricData(metrics, (err, data) => {
        if (err) {
            cb(err, data)
        }
        console.log(data)
        let res = `Healthcheck ${isOK ? 'OK': 'KO'} : ${statusCode || ''} ${err || ''}`
        console.log(res)
        cb(null,res)
    })
    
}
