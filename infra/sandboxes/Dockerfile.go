FROM golang:1.22-alpine
WORKDIR /sandbox
USER nobody
CMD ["go", "version"]
