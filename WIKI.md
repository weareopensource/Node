## Introduction 

Welcome to the Node wiki! Here you will find various information about this repo.

## Menu 

#### Global Wiki

* [home](https://github.com/weareopensource/weareopensource.github.io/wiki)

#### Node Wiki 

* [Api](https://github.com/weareopensource/Node/blob/master/WIKI.md#API)
* [SSL](https://github.com/weareopensource/Node/blob/master/WIKI.md#SSL)


#### Other informations

* [Knowledges](https://github.com/weareopensource/Node/blob/master/KNOWLEDGES.md)
* [Changelog](https://github.com/weareopensource/Node/blob/master/CHANGELOG.md)
* [Licence](https://github.com/weareopensource/Node/blob/master/LICENSE.md)
* [Contribute](https://github.com/weareopensource/weareopensource.github.io/wiki/Contribute)

#### WAOS

* [Our Mindset](https://weareopensource.me/introduction/)
* [Our Roadmap](https://github.com/weareopensource/weareopensource.github.io/projects)
* [Us](https://github.com/weareopensource/weareopensource.github.io/wiki/Us)
* [Help Us](https://github.com/weareopensource/weareopensource.github.io/wiki/HelpUs)

# Node WIKI

## API

### success

`responses.success(res, 'task created')({});`

body : 

```
{ 
	type: 'success', 
	message: 'task created' 
	data: {}
}
```

### errors

#### default

`responses.error(res, 422, 'task creation failed')({err});`

body : 

```
{ 
	type: 'error', 
	message: 'task creation failed' 
	error: {err}
}
```

#### schema

`responses.error(res, 422, errors.getMessage(err))({err});`

body : 

```
{ 
	type: 'error',
	message: 'schema validation error',
	error: { 
		original: { 
			title: 2, 
			description: 'do something about something else' 
		},
       details: [{
       	message: 'title must be a string', 
       	type: 'string.base'
       }] 
   } 
}
```

#### service & others

`throw new AppError('invalid user or password.', { code: 'SERVICE_ERROR', details: [] });`

body : 

```
{ 
	type: 'error',
   message: 'invalid user or password.',
   error: { 
	   code: 'SERVICE_ERROR',
	   details: [] 
   } 
}
```

#### Authentication

status : 401 
error : 

```
{
	text: 'Unauthorized'
}
```

## SSL

There are two ways to set up https, the most used way is to set up a reverse proxy in front of the server node, and enable let's encrypt.

The second is to set up https directly at the node server.

Both are possible with the stack.

### Reverse Proxy with Let's Encrypt 

We recommend this method, however we will not explain it. Many [tutorials](https://www.google.com/search?client=safari&rls=en&ei=ZFqwXNGMB43jgweCnbXgCg&q=node+let%27s+encrypt+nginx&oq=node+let%27s+encrypt+nginx&gs_l=psy-ab.3..0i8i13i30l3.9384.13054..13286...0.0..0.52.1036.24......0....1..gws-wiz.......0i71j0i67j0j0i131j0i22i30j0i13i30j0i13i10i30j0i19j0i13i30i19j0i22i30i19j0i22i10i30i19j0i8i13i30i19.ejqWS4vw2Qs) already exist, and it depends on what you use, [apache](https://httpd.apache.org), [nginx](https://www.nginx.com), [traeffik](https://traefik.io), [Let's Encrypt](https://letsencrypt.org) ...

### Express TLS - SSL

To run your application in a secure manner with express you'll need to use OpenSSL and generate a set of self-signed certificates. 

* Unix-based users can use the following command:

	```bash
	$ npm run generate-ssl-certs
	```
this will create cert and key files and place them in *config/sslcerts* folder.

* Windows users can follow instructions found [here](http://www.websense.com/support/article/kbarticle/How-to-use-OpenSSL-and-Microsoft-Certification-Authority).
After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, uncomment and activate ssl in configuration (*config/defaults/development.js*) :

```
// SSL on express server (FYI : Wiki)
secure: {
   ssl: true,
   key: './config/sslcerts/key.pem',
   cert: './config/sslcerts/cert.pem',
},
```
