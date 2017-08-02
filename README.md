# alarm-pwa
 Webapp experiment, an attempt to wake up a locked Android phone with a notification.

##  Contributing

### 0. Install development dependencies

```
npm install
```

### 1. Edit Config file

The config.toml file is where all setup is made, edit this file to fill
in the blanks.

#### 1.1 Web Push

If you need to create a new pair of VAPID keys use the command:

```
npm start generate:keys
```

The public one is shared between the clients and your push server.

### 2. Generate Production Bundle
To generate a static page with the bundled dependencies under the ```docs``` subfolder (served by github pages) use:

```
npm start bundle
```

### 3. Development Webserver
You can also test the app on a development local server ([budo][budo]) that auto generates the main app bundle on thee fly. To start it run:

```
npm start
```

Note that the service workers file (sw.js) wont auto-include dependencies, 

### 4. Other tasks

To get a list of all available build tasks type:

```
npm start help
```

[budo]: https://github.com/mattdesl/budo

