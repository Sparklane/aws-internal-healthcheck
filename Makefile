run:
	@docker run --rm -v $(PWD):/var/task \
		-e PORT=3000 \
		-e HOSTNAME=prometheus.prod.sparklane\
		-e METRIC_NAME=TestHealthCheck \
		-e INVERT_HEALTHCHECK_STATUS=false \
		-e METRIC_NAMESPACE=HealthCheck \
		-e TIMEOUT=5 \
		-e AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
		-e AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) \
		-e AWS_REGION=$(AWS_REGION) \
		lambci/lambda:nodejs8.10

runhttps:
	@docker run --rm -v $(PWD):/var/task \
		-e PROTOCOL=https \
		-e HOSTNAME=localhost \
		-e METRIC_NAME=TestHealthCheck \
		-e METRIC_NAMESPACE=HealthCheck \
		-e AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
		-e AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) \
		-e AWS_REGION=$(AWS_REGION) \
		lambci/lambda:nodejs8.10

publish:
	@aws cloudformation package \
		--template-file ./template.yml \
		--output-template-file serverless-output.yaml \
		--s3-bucket lambda.sparklane \
		--s3-prefix aws-internal-healthCheck
