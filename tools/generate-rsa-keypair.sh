#!/bin/bash
# Gen Private key
openssl genrsa -out private.pem 4096
# Gen Public key
openssl rsa -in private.pem -pubout -outform PEM -out public.pem
