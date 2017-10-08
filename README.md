# jobgetwebsite
To deploy:

	npm install
	serverless config credentials --provider aws --key $AWS_ACCESS_KEY_ID --secret $AWS_SECRET_ACCESS_KEY
	serverless deploy
	serverless client deploy
