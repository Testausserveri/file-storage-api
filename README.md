# File Storage API

Simple HTTP API for reading, listing, uploading and deleting files from a server.

- [File Storage API](#file-storage-api)
  - [Getting Started](#getting-started)
    - [Docker Compose](#docker-compose)
  - [API Documentation](#api-documentation)
    - [Authorization](#authorization)
    - [Errors](#errors)

## Getting Started

### Docker Compose

First, create a file `.apikeys` with whitelisted random-generated API keys on each line.

Create a `docker-compose.yml`:
```yaml
services:
  file-storage-api:
    image: ghcr.io/testausserveri/file-storage-api
    volumes:
      - ./.apikeys:/app/.apikeys
      - ./media:/app/uploads
    ports:
      - 8080:8080
```

Run:
```
$ docker compose up
```

## API Documentation

<table>
<tr>
<td>Method</td>
<td>Path</td>
<td>Description</td>
<td>Sample</td>
</tr>
<tr>
<td>GET</td>
<td>/</td>
<td>Return list of files</td>
<td>
200 OK

```json
{
    "files": [
        "7he9s-logo.jpg",
        "hsmpy-logo.jpg",
        "zb8ae-logo.jpg"
    ]
}
```

</td>
</tr>
<tr>
<td>POST</td>
<td>/</td>
<td>Upload a file in <code>file</code> form-data key</td>
<td>
200 OK

```json
{
    "filename": "7he9s-logo.jpg"
}
```

</td>
</tr>
<tr>
<td>GET</td>
<td>/<i>filename</i></td>
<td>Get file</td>
<td>
200 OK

<i>The requested file</i>
</td>
</tr>
<tr>
<td>DELETE</td>
<td>/<i>filename</i></td>
<td>Delete file</td>
<td>
200 OK

```json
{
    "filename": "7he9s-logo.jpg"
}
```

</td>
</tr>
</table>

### Authorization
All endpoints require an authorization. It is passed to the authorization header with an value `ApiKey your-api-key`.
```
Authorization: ApiKey your-api-key
```

Add your own API keys to `.apikeys` file, each on their own line.

### Errors
Errors are responded with a non-200 status code and a JSON-object such as:
```json
{
    "error": "reason"
}
```
