#!/bin/bash

echo "Which cloud provider do you use?"
read -p "azure/gcp/other: " cloud_provider_input
cloud_provider="${cloud_provider_input,,}"

echo "Which domains do you use for your emails?"
read -p "comma separated list: " internal_domain_list_input
internal_domain_list="${internal_domain_list_input,,}"

echo "Do you want to enable Google Workspace API?"
read -p "y/n: " google_workspace_input
google_workspace="${google_workspace_input,,}"

echo "Do you want to enable Office 365 API?"
read -p "y/n: " office_365_input
office_365="${office_365_input,,}"

echo "Do you want to enable https?"
read -p "y/n: " https_input
https="${https_input,,}"

echo "Do you want to encrypt email addresses?"
read -p "y/n: " full_anonymization_input
full_anonymization="${full_anonymization_input,,}"

# Use key store?
key_store=false
if [[ $cloud_provider == "azure" || $cloud_provider == "gcp" ]]; then
  key_store=true
fi

# Gen RSA key-pair?
rsa_public_key=""
rsa_private_key=""
if [[ $full_anonymization == "y" ]]; then
  $(./generate-rsa-keypair.sh)

  rsa_public_key="$(./to-one-line-pem.sh public.pem)"
  rsa_private_key="$(./to-one-line-pem.sh  private.pem)"

  rm private.pem
  rm public.pem
fi

# Gen self signed cert?
ssl_key=""
ssl_cert=""
if [[ $https == "y" ]]; then
  $(./generate-self-signed-cert.sh)

  ssl_key="$(./to-one-line-pem.sh key.pem)"
  ssl_cert="$(./to-one-line-pem.sh cert.pem)"

  rm key.pem
  rm cert.pem
fi

# Gen random api token
api_token=$(./generate-random-string.sh 16)

# Google workspace
gsuite_client_email="example@example.iam.gserviceaccount.com"
gsuite_private_key="-----BEGIN PRIVATE KEY-----\nMIIE...xzA==\n-----END PRIVATE KEY-----\n"
gsuite_scopes="https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/calendar.readonly"

# Office 365
o365_tenant_id="00000000-0000-0000-0000-000000000000"
o365_client_id="00000000-0000-0000-0000-000000000000"
o365_client_secret="secret"

# Ports
http_port=80
https_port=443

# Email options
anonymize_external_email_domain=true
anonymize_external_email_username=true
anonymize_internal_email_domain=false
anonymize_internal_email_username=true
enable_internal_email_plus_addressing=true
enable_external_email_plus_addressing=true

# Enviromental variables
echo ""
echo "+------------------------+"
echo "| Enviromental variables |"
echo "+------------------------+"
if [[ $https == "y" ]]; then
  echo "HTTPS_PORT=$https_port"
else
  echo "HTTP_PORT=$http_port"
fi
echo "ANONYMIZE_EXTERNAL_EMAIL_DOMAIN=$anonymize_external_email_domain"
echo "ANONYMIZE_EXTERNAL_EMAIL_USERNAME=$anonymize_external_email_username"
echo "ANONYMIZE_INTERNAL_EMAIL_DOMAIN=$anonymize_internal_email_domain"
echo "ANONYMIZE_INTERNAL_EMAIL_USERNAME=$anonymize_internal_email_username"
echo "ENABLE_INTERNAL_EMAIL_PLUS_ADDRESSING=$enable_internal_email_plus_addressing"
echo "ENABLE_EXTERNAL_EMAIL_PLUS_ADDRESSING=$enable_external_email_plus_addressing"
if [ "$internal_domain_list" ]; then
  echo "INTERNAL_DOMAIN_LIST=$internal_domain_list"
fi

if $key_store; then
  # Key store
  echo ""
  echo "+------------------------+"
  if [[ $cloud_provider == "gcp" ]]; then
  echo "| GCP Secret Manager     |"
  else 
  echo "| Azure Key Vault        |"
  fi
  echo "+------------------------+"
  echo "API-TOKEN=$api_token"
  if [ "$ssl_key" ]; then
    echo "SSL-KEY=$ssl_key"
  fi
  if [ "$ssl_cert" ]; then
    echo "SSL-CERT=$ssl_cert"
  fi
  if [ "$rsa_public_key" ]; then
    echo "RSA-PUBLIC-KEY=$rsa_public_key"
  fi
  if [ "$rsa_private_key" ]; then
    echo "RSA-PRIVATE-KEY=$rsa_private_key"
  fi
  if [[ $google_workspace == "y" ]]; then
    echo "GSUITE-CLIENT-EMAIL=$gsuite_client_email"
    echo "GSUITE-PRIVATE-KEY=$gsuite_private_key"
    echo "GSUITE-SCOPES=$gsuite_scopes"
  fi
  if [[ $office_365 == "y" ]]; then
    echo "O365-TENANT-ID=$o365_tenant_id"
    echo "O365-CLIENT-ID=$o365_client_id"
    echo "O365-CLIENT-SECRET=$o365_client_secret"
  fi
else
  # Env variables
  echo "API_TOKEN=$api_token"
  if [ "$ssl_key" ]; then
    echo "SSL_KEY=$ssl_key"
  fi
  if [ "$ssl_cert" ]; then
    echo "SSL_CERT=$ssl_cert"
  fi
  if [ "$rsa_public_key" ]; then
    echo "RSA_PUBLIC_KEY=$rsa_public_key"
  fi
  if [ "$rsa_private_key" ]; then
    echo "RSA_PRIVATE_KEY=$rsa_private_key"
  fi
  if [[ $google_workspace == "y" ]]; then
    echo "GSUITE_CLIENT_EMAIL=$gsuite_client_email"
    echo "GSUITE_PRIVATE_KEY=$gsuite_private_key"
    echo "GSUITE_SCOPES=$gsuite_scopes"
  fi
  if [[ $office_365 == "y" ]]; then
    echo "O365_TENANT_ID=$o365_tenant_id"
    echo "O365_CLIENT_ID=$o365_client_id"
    echo "O365_CLIENT_SECRET=$o365_client_secret"
  fi
fi
