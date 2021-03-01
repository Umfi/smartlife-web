import axios from "axios";
import { config } from "../config.js"
import { getAccessToken } from "./AuthService.js";

function buildApiUrl(path) {
    var access_token = getAccessToken();

    if (access_token) {
        var api_url;
          
        if (access_token.substring(0,2) === "EU") {
            api_url = config.SMARTLIFE_API_URL + path;
        } else if (access_token.substring(0,2) === "AY") {
            api_url = config.SMARTLIFE_API_URL.replace("eu", "cn") + path;
        } else {
            api_url = config.SMARTLIFE_API_URL.replace("eu", "us") + path;
        }
        
        return api_url;  
    }

    return false;
}

// From https://github.com/ndg63276/smartlife/blob/e80f69b8995813f33a3706acb48f4b555b418122/functions.js#L126
function merge_devices(a, b){
	if (b == null) { return a }
	if (a.length != b.length) { return a }
	for (var device in b) {
		if (!("data" in b[device])) { continue; }
		if (!("data" in a[device])) { continue; }
		for (var prop in b[device]["data"]) {
			if (!(prop in a[device]["data"])) {
				a[device]["data"][prop] = b[device]["data"][prop];
			}
		}
	}
	return a;
}

export async function getDevices() {

    const headers = {
        'Content-Type': 'application/json',
    }

    var formData = {
		"header": {
			"name": "Discovery",
			"namespace": "discovery",
			"payloadVersion": 1,
		},
		"payload": {
			"accessToken": getAccessToken(),
		},
	}

    var api_url = buildApiUrl("skill")
    const data = await axios({ url: config.CORS_PROXY_URL+api_url, data: JSON.stringify(formData), method: 'POST', headers: headers })
    
        .then(resp => {
            var json = resp.data;
            var devices = [];
            var stored_devices = [];

            console.log(json);

            if ("header" in json && "code" in json["header"] && json["header"]["code"] === "FrequentlyInvoke") {
				if (localStorage.devices) {
                    devices = JSON.parse(localStorage.devices);	
                }
			} else if ("payload" in json && "devices" in json["payload"]) {
                if (localStorage.devices) {
                    stored_devices = JSON.parse(localStorage.devices);	
                }
				devices = merge_devices(json["payload"]["devices"], stored_devices);
				localStorage.devices = JSON.stringify(devices);
			}

            return devices;
        })
        .catch(err => {
            console.error(err);
            return [];
        })

        return data;
}

async function sendCommandToDevice(deviceID, action, value_name, new_state) {

    const headers = {
        'Content-Type': 'application/json',
    }

    var formData = {
		"header": {
			"name": action,
			"namespace": "control",
			"payloadVersion": 1,
		},
		"payload": {
			"accessToken": getAccessToken(),
            "devId": deviceID,
            [value_name]: new_state
		},
	}

    var api_url = buildApiUrl("skill")
    const data = await axios({ url: config.CORS_PROXY_URL+api_url, data: JSON.stringify(formData), method: 'POST', headers: headers })
        .then(resp => {
            var json = resp.data;
            return json;
        })
        .catch(err => {
            console.error(err);
            return false;
        })

        return data;
}


export async function toggleDevice(deviceID, state, devType) {
    var new_state = 1;
	
    if (state === false || devType === "scene") {
		new_state = 0;
	}

    const result = await sendCommandToDevice(deviceID, "turnOnOff", "value", new_state)
    if (result) {
        if ("header" in result && "code" in result["header"] && result["header"]["code"] === "SUCCESS" && devType !== "scene"){
            if (localStorage.devices) {
                var devices = JSON.parse(localStorage.devices);	
                for (var i = 0; i < devices.length; i++) {
                    if(deviceID === devices[i].id){  
                        devices[i].data.state = state
                        break;
                    }
                 }
                 localStorage.setItem("devices", JSON.stringify(devices));
            }
            return true;
        }
    }

    return false;
}

export async function adjustBrightness(deviceID, brightness) {
    
    if (brightness < 0) {
		brightness = 0;
	} else if (brightness > 255) {
		brightness = 255;
	} 

    const result = await sendCommandToDevice(deviceID, "brightnessSet", "value", brightness)
    if (result) {
        if ("header" in result && "code" in result["header"] && result["header"]["code"] === "SUCCESS"){
            if (localStorage.devices) {
                var devices = JSON.parse(localStorage.devices);	
                for (var i = 0; i < devices.length; i++) {
                    if(deviceID === devices[i].id){  
                        devices[i].data.brightness = brightness
                        break;
                    }
                 }
                 localStorage.setItem("devices", JSON.stringify(devices));
            }
            return true;
        }
    }

    return false;
}

export async function adjustColorTemperature(deviceID, colorTemperature) {
    
    if (colorTemperature < 1000) {
		colorTemperature = 1000;
	} else if (colorTemperature > 10000) {
		colorTemperature = 10000;
	} 

    const result = await sendCommandToDevice(deviceID, "colorTemperatureSet", "value", colorTemperature)
    if (result) {
        if ("header" in result && "code" in result["header"] && result["header"]["code"] === "SUCCESS"){
            if (localStorage.devices) {
                var devices = JSON.parse(localStorage.devices);	
                for (var i = 0; i < devices.length; i++) {
                    if(deviceID === devices[i].id){  
                        devices[i].data.color_temp = colorTemperature
                        break;
                    }
                 }
                 localStorage.setItem("devices", JSON.stringify(devices));
            }
            return true;
        }
    }

    return false;
}