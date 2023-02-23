#!/usr/bin/env node

import { minimist } from 'minimist'
import { moment } from 'moment-timezone'
import { fetch } from 'node-fetch'

const args = minimist(process.argv.slice(2));

if (args.h != null) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n")
    console.log("-h            Show this help message and exit.\n")
    console.log("-n, -s        Latitude: N positive; S negative.\n")
    console.log("-e, -w        Longitude: E positive; W negative.\n")
    console.log("-z            Time zone: uses tz.guess() from moment-timezone by default.\n")
    console.log("-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n")
    console.log("-j            Echo pretty JSON from open-meteo API and exit.\n")
    exit(0);
}

//Make latitude variable
var latitude
if (args.n != null) {
    latitude = args.n
} else if (args.s != null) {
    latitude = 0 - args.s
} else {
    latitude = 35.9
}

//Make longitude variable
var longitude
if (args.e != null) {
    longitude = args.e
} else if (args.w != null) {
    longitude = 0 - args.w
} else {
    longitude = -79.04
}
//Make timezone variable
var timezone
if (args.z != null) {
    timezone = args.z
} else {
    timezone = moment.tz.guess()
}
//Make days constant
var days
if (args.d != null) {
    days = args.d 
} else {
    days = 1
}

//Construct url
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=weathercode,precipitation_hours&timezone=' + timezone + '&start_date=2023-02-15&end_date=2023-02-21')

const data = await response.json()

if (args.j != null) {
    console.log(data)
    exit(0)
}

if (data.daily.precipitation_hours[days] > 0 && data.daily.precipitation_hours[days] < 3) {
    console.log("You might need your galoshes ")
} else if (data.daily.precipitation_hours[days] >= 3) {
    console.log("You will probably need your galoshes ")
} else {
    console.log("You probably won't need your galoshes ")
}

if (days == 0) {
    console.log("today.\n")
  } else if (days > 1) {
    console.log("in " + days + " days.\n")
  } else {
    console.log("tomorrow.\n")
}

