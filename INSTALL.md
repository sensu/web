# Installation

To install the Sensu Web UI, you will need Yarn. If you don't have this,
please see [yarn installation](https://classic.yarnpkg.com/en/docs/install/).

Next obtain the Sensu Web code to some location on your system. For example:

```
mkdir /opt/sensu
cd /opt/sensu
git clone https://github.com/sensu/web.git
cd web
```

Now you can run the UI like this:

```bash
yarn install
NODE_ENV=production PORT=5000 API_URL=https://my-sensu-backend-api:8080 yarn node scripts serve
```
By default, this will listen on all interfaces. To restrict serving to a specific network interface, add a `HOST=` environment variable (eg. `HOST=127.0.0.1`).

You should probably avoid running Sensu Web as the root user. To run as another user, perform the `git clone` step above and the steps to run the application as the ordinary user you want to use.

## File Watchers

If you run Sensu Web on a fresh system, it's likely you'll see errors like:

```
Error from chokidar (/opt/sensu/web/node_modules/@material-ui/icons): Error: ENOSPC: System limit for number of file watchers reached, watch '/opt/sensu/web/node_modules/@material-ui/icons/ZoomOutMapRounded.js'
```
This is a problem with node.js unnecessarily trying to watch 130,000 files in
the `node_modules` directory. Until a better solution is found, a workaround is to
increase the system-wide limit:

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## Running in Production

In production, you probably don't want the source code files owned by the
user running them. You probably don't want the `node_modules` directory in the
same place as the source code either. It's possible to have Yarn create the
`node_modules` directory somewhere else. For example:

```bash
yarn install --modules-folder /opt/sensu/yarn/node_modules
```

You can then run the application with this:

```bash
NODE_ENV=production PORT=5000 API_URL=https://my-sensu-backend-api:8080 yarn node scripts serve --modules-folder /opt/sensu/yarn/node_modules
```

This almost works completely, except Yarn may still try to write a log file in the source code directory (and still suffers from the watcher problem above).

You may also want to start the service via systemd. A Service Unit file something like this may suffice (assuming you put a sysconfig file in place with the environment variables you want in it):
```
[Unit]
Description=Sensu Web UI Service
After=network.target

[Service]
EnvironmentFile=/etc/sysconfig/sensu_web
ExecStart=/bin/yarn node scripts serve --modules-folder /opt/sensu/yarn/node_modules
User=sensu_web
Group=sensu_web
WorkingDirectory=/opt/sensu/web

[Install]
WantedBy=multi-user.target
```

## TLS/SSL

There's no immediate way to enable TLS/SSL on the application web service. Instead,
consider running Apache or Nginx "in front" of the application and have that do
all the SSL and certificate work. This may be beneficial if you want to use
something like fail2ban or LetsEncrypt certificates too.
