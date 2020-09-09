const os = require('os');
const userRoles = require('../userRoles');

const {
	BYPASS_ROOM_LOCK,
	BYPASS_LOBBY
} = require('../access');

const {
	CHANGE_ROOM_LOCK,
	PROMOTE_PEER,
	SEND_CHAT,
	MODERATE_CHAT,
	SHARE_SCREEN,
	EXTRA_VIDEO,
	SHARE_FILE,
	MODERATE_FILES,
	MODERATE_ROOM
} = require('../permissions');

// const AwaitQueue = require('awaitqueue');
// const axios = require('axios');

// To gather ip address only on interface like eth0, ens0p3
// const ifaceWhiteListRegex = '^(eth.*)|(ens.*)'

// function getListenIps() { //old
// 	let listenIP = [];
// 	const ifaces = os.networkInterfaces();
// 	Object.keys(ifaces).forEach(function (ifname) {
// 		if (ifname.match(ifaceWhiteListRegex)) {
// 			ifaces[ifname].forEach(function (iface) {
// 				if (
// 					(iface.family !== "IPv4" &&
// 						(iface.family !== "IPv6" || iface.scopeid !== 0)) ||
// 					iface.internal !== false
// 				) {
// 					// skip over internal (i.e. 127.0.0.1) and non-ipv4 or ipv6 non global addresses
// 					return;
// 				}
// 				listenIP.push({ ip: iface.address, announcedIp: null });
// 			});
// 		}
// 	});
// 	return listenIP;
// }

function getListenIps() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
 
  Object.keys(interfaces).forEach((netInterface) => {
   interfaces[netInterface].forEach((interfaceObject) => {
    if (interfaceObject.family === 'IPv4' && !interfaceObject.internal) {
     addresses.push({ ip: interfaceObject.address, announcedIp: null });
    }
   });
  });
  return(addresses);
 }



module.exports =
{

	// Auth conf
	/*
	auth :
	{
		lti :
		{
			consumerKey    : '_bo2uqnwon1ym4qkte5hhd4fzlnoufvts5h3hblxzcy',
			consumerSecret : '_1xpnaa4iw36cwpnx7991e630yo0u4044so1crhvcnz'
		},
		oidc:
		{
			// The issuer URL for OpenID Connect discovery
			// The OpenID Provider Configuration Document
			// could be discovered on:
			// issuerURL + '/.well-known/openid-configuration'

			// e.g. google OIDC config
			// Follow this guide to get credential:  
			// https://developers.google.com/identity/protocols/oauth2/openid-connect
			// use this issuerURL
			// issuerURL     : 'https://accounts.google.com/',
			
			issuerURL     : 'https://example.com',
			clientOptions :
			{
				client_id     : '',
				client_secret : '',
				scope       		: 'openid email profile',
				// where client.example.com is your eduMeet server
				redirect_uri  : 'https://client.example.com/auth/callback'
			}

		}
	},
	*/
	// URI and key for requesting geoip-based TURN server closest to the client
	turnAPIKey: 'examplekey',
	turnAPIURI: 'turn:numb.viagenie.ca',
	turnAPIparams: {
		'uri_schema': 'turn',
		'transport': 'tcp',
		'ip_ver': 'ipv4',
		'servercount': '2'
	},

	// Backup turnservers if REST fails or is not configured
	backupTurnServers: [
		{
			urls: [
				'turn:numb.viagenie.ca'
			],
			username: 'webrtc@live.com',
			credential: 'muazkh'
		}
	],
	fileTracker: 'wss://tracker.lab.vvc.niif.hu:443',
	redisOptions: {},
	// session cookie secret
	cookieSecret: 'T0P-S3cR3t_cook!e',
	cookieName: 'new-edutech.sid',
	// if you use encrypted private key the set the passphrase
	tls:
	{
		cert: `${__dirname}/../certs/cert.pem`,
		// passphrase: 'key_password'
		key: `${__dirname}/../certs/privkey.pem`
	},
	// listening Host or IP 
	// If omitted listens on every IP. ("0.0.0.0" and "::")
	// listeningHost: 'localhost',
	// Listening port for https server.
	listeningPort: 443,
	// Any http request is redirected to https.
	// Listening port for http server.
	listeningRedirectPort: 8080,
	// Listens only on http, only on listeningPort
	// listeningRedirectPort disabled
	// use case: loadbalancer backend
	httpOnly: false,
	// WebServer/Express trust proxy config for httpOnly mode
	// You can find more info:
	//  - https://expressjs.com/en/guide/behind-proxies.html
	//  - https://www.npmjs.com/package/proxy-addr
	// use case: loadbalancer backend
	trustProxy: '',
	// This logger class will have the log function
	// called every time there is a room created or destroyed,
	// or peer created or destroyed. This would then be able
	// to log to a file or external service.
	/* StatusLogger          : class
	{
		constructor()
		{
			this._queue = new AwaitQueue();
		}

		// rooms: rooms object
		// peers: peers object
		// eslint-disable-next-line no-unused-vars
		async log({ rooms, peers })
		{
			this._queue.push(async () =>
			{
				// Do your logging in here, use queue to keep correct order

				// eslint-disable-next-line no-console
				console.log('Number of rooms: ', rooms.size);
				// eslint-disable-next-line no-console
				console.log('Number of peers: ', peers.size);
			})
				.catch((error) =>
				{
					// eslint-disable-next-line no-console
					console.log('error in log', error);
				});
		}
	}, */
	// This function will be called on successful login through oidc.
	// Use this function to map your oidc userinfo to the Peer object.
	// The roomId is equal to the room name.
	// See examples below.
	// Examples:
	/*
	// All authenicated users will be MODERATOR and AUTHENTICATED
	userMapping : async ({ peer, roomId, userinfo }) =>
	{
		peer.addRole(userRoles.MODERATOR);
		peer.addRole(userRoles.AUTHENTICATED);
	},
	// All authenicated users will be AUTHENTICATED,
	// and those with the moderator role set in the userinfo
	// will also be MODERATOR
	userMapping : async ({ peer, roomId, userinfo }) =>
	{
		if (
			Array.isArray(userinfo.meet_roles) &&
			userinfo.meet_roles.includes('moderator')
		)
		{
			peer.addRole(userRoles.MODERATOR);
		}

		if (
			Array.isArray(userinfo.meet_roles) &&
			userinfo.meet_roles.includes('meetingadmin')
		)
		{
			peer.addRole(userRoles.ADMIN);
		}

		peer.addRole(userRoles.AUTHENTICATED);
	},
	// All authenicated users will be AUTHENTICATED,
	// and those with email ending with @example.com
	// will also be MODERATOR
	userMapping : async ({ peer, roomId, userinfo }) =>
	{
		if (userinfo.email && userinfo.email.endsWith('@example.com'))
		{
			peer.addRole(userRoles.MODERATOR);
		}

		peer.addRole(userRoles.AUTHENTICATED);
	}
	// All authenicated users will be AUTHENTICATED,
	// and those with email ending with @example.com
	// will also be MODERATOR
	userMapping : async ({ peer, roomId, userinfo }) =>
	{
		if (userinfo.email && userinfo.email.endsWith('@example.com'))
		{
			peer.addRole(userRoles.MODERATOR);
		}

		peer.addRole(userRoles.AUTHENTICATED);
	},
	*/
	// eslint-disable-next-line no-unused-vars
	userMapping: async ({ peer, roomId, userinfo }) => {
		if (userinfo.picture != null) {
			if (!userinfo.picture.match(/^http/g)) {
				peer.picture = `data:image/jpeg;base64, ${userinfo.picture}`;
			}
			else {
				peer.picture = userinfo.picture;
			}
		}

		if (userinfo.nickname != null) {
			peer.displayName = userinfo.nickname;
		}

		if (userinfo.name != null) {
			peer.displayName = userinfo.name;
		}

		if (userinfo.email != null) {
			peer.email = userinfo.email;
		}
	},
	// All users have the role "NORMAL" by default. Other roles need to be
	// added in the "userMapping" function. The following accesses and
	// permissions are arrays of roles. Roles can be changed in userRoles.js
	//
	// Example:
	// [ userRoles.MODERATOR, userRoles.AUTHENTICATED ]
	accessFromRoles: {
		// The role(s) will gain access to the room
		// even if it is locked (!)
		[BYPASS_ROOM_LOCK]: [userRoles.ADMIN],
		// The role(s) will gain access to the room without
		// going into the lobby. If you want to restrict access to your
		// server to only directly allow authenticated users, you could
		// add the userRoles.AUTHENTICATED to the user in the userMapping
		// function, and change to BYPASS_LOBBY : [ userRoles.AUTHENTICATED ]
		[BYPASS_LOBBY]: [userRoles.NORMAL]
	},
	permissionsFromRoles: {
		// The role(s) have permission to lock/unlock a room
		[CHANGE_ROOM_LOCK]: [userRoles.MODERATOR],
		// The role(s) have permission to promote a peer from the lobby
		[PROMOTE_PEER]: [userRoles.NORMAL],
		// The role(s) have permission to send chat messages
		[SEND_CHAT]: [userRoles.NORMAL],
		// The role(s) have permission to moderate chat
		[MODERATE_CHAT]: [userRoles.MODERATOR],
		// The role(s) have permission to share screen
		[SHARE_SCREEN]: [userRoles.NORMAL],
		// The role(s) have permission to produce extra video
		[EXTRA_VIDEO]: [userRoles.NORMAL],
		// The role(s) have permission to share files
		[SHARE_FILE]: [userRoles.NORMAL],
		// The role(s) have permission to moderate files
		[MODERATE_FILES]: [userRoles.MODERATOR],
		// The role(s) have permission to moderate room (e.g. kick user)
		[MODERATE_ROOM]: [userRoles.MODERATOR]
	},
	// Array of permissions. If no peer with the permission in question
	// is in the room, all peers are permitted to do the action. The peers
	// that are allowed because of this rule will not be able to do this 
	// action as soon as a peer with the permission joins. In this example
	// everyone will be able to lock/unlock room until a MODERATOR joins.
	allowWhenRoleMissing: [CHANGE_ROOM_LOCK],
	// When truthy, the room will be open to all users when as long as there
	// are allready users in the room
	activateOnHostJoin: true,
	// When set, maxUsersPerRoom defines how many users can join
	// a single room. If not set, there is no limit.
	// maxUsersPerRoom    : 20,
	// Room size before spreading to new router
	routerScaleSize: 40,
	// Socket timout value
	requestTimeout: 20000,
	// Socket retries when timeout
	requestRetries: 3,
	// Mediasoup settings
	mediasoup:
	{
		numWorkers: Object.keys(os.cpus()).length,
		// mediasoup Worker settings.
		worker:
		{
			logLevel: 'warn',
			logTags:
				[
					'info',
					'ice',
					'dtls',
					'rtp',
					'srtp',
					'rtcp'
				],
			rtcMinPort: 40000,
			rtcMaxPort: 49999
		},
		// mediasoup Router settings.
		router:
		{
			// Router media codecs.
			mediaCodecs:
				[
					{
						kind: 'audio',
						mimeType: 'audio/opus',
						clockRate: 48000,
						channels: 2
					},
					{
						kind: 'video',
						mimeType: 'video/VP8',
						clockRate: 90000,
						parameters:
						{
							'x-google-start-bitrate': 1000
						}
					},
					{
						kind: 'video',
						mimeType: 'video/VP9',
						clockRate: 90000,
						parameters:
						{
							'profile-id': 2,
							'x-google-start-bitrate': 1000
						}
					},
					{
						kind: 'video',
						mimeType: 'video/h264',
						clockRate: 90000,
						parameters:
						{
							'packetization-mode': 1,
							'profile-level-id': '4d0032',
							'level-asymmetry-allowed': 1,
							'x-google-start-bitrate': 1000
						}
					},
					{
						kind: 'video',
						mimeType: 'video/h264',
						clockRate: 90000,
						parameters:
						{
							'packetization-mode': 1,
							'profile-level-id': '42e01f',
							'level-asymmetry-allowed': 1,
							'x-google-start-bitrate': 1000
						}
					}
				]
		},
		// mediasoup WebRtcTransport settings.
		webRtcTransport:
		{
			listenIps : getListenIps(),
			initialAvailableOutgoingBitrate: 1000000,
			minimumAvailableOutgoingBitrate: 600000,
			// Additional options that are not part of WebRtcTransportOptions.
			maxIncomingBitrate: 1500000
		}
	}
	// Prometheus exporter
	/*
	prometheus: {
		deidentify: false, // deidentify IP addresses
		numeric: false, // show numeric IP addresses
		port: 8889, // allocated port
		quiet: false // include fewer labels
	}
	*/
};
