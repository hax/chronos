# Conference Room System

[![Greenkeeper badge](https://badges.greenkeeper.io/hax/chronos.svg)](https://greenkeeper.io/)

## Install

### Step 0
Need Node.js V6.7+

### Step 1
```sh
git clone https://github.com/hax/chronos.git
cd chronos
npm install
```

### Step 2
Create config files

#### `app-config.json`
```json
{
	"oauth": "https://login.chinacloudapi.cn",
	"serviceRoot": "https://microsoftgraph.chinacloudapi.cn",
	"tenantId": <TenantId>,
	"clientId": <ClientId>,
	"clientSecret": <ClientSecret>
}
```

#### `iot-config.json`
```json
{
	"servers": [
		{ "host": <Host>, "port": <Port> }
	],
	"username": <UserName>,
	"password": <Password>
}
```

### Step 3
```sh
npm start
```

Then visit: `http://<server>:8080/`
