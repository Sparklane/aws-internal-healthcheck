# AWS Internal Healthcheck

Perform healthchecks on private IP or private FQDN (Private Route53). Healthchecks status are pushed to Cloudwatch custom metrics.

Made with ❤️ by Sparklane. Available on the [AWS Serverless Application Repository](https://aws.amazon.com/serverless)

## Setup

AWS Route53 healthchecks cannot target private endpoint within a private VPC. This lambda function will try to perform an healthcheck and send metrics to Cloudwatch. Metric value will be:
* 1 for Healthcheck OK
* 0 for Healthcheck Not OK
* none if no healthcheck has been performed (if this lambda failed to run)

Once this healthcheck metrics are in Cloudwatch, it's up to you to:
* Schedule it (using Cloudwatch Events)
* Configure an Alert (using Cloudwatch Alerts)

## Configuration

| Env Variable | Default | Description |
|----------|---------|-------------|
|`PROTOCOL` | `http` | `http` or `https` |
|`HOSTNAME` | `localhost` | Hostname or IP address |
|`PORT` | `80` | Port to test |
|`URL_PATH` | `/` | Path to test | 
|`STRING_MATCHING` | _undefined_ | Will return OK if the string is contained in the response's body otherwise |
|`INVERT_HEALTHCHECK_STATUS` | `false` | this will invert healthcheck result (ok will become ko) |
|`METRIC_NAME` | `MyService` | Name of the Cloudwatch metrics |
|`METRIC_NAMESPACE` | `HealthCheck` | Namespace of the Cloudwatch Metric |



