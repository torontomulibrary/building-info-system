[![Build Status](https://travis-ci.org/ryersonlibrary/building-info-system.svg?branch=master)](https://travis-ci.org/ryersonlibrary/building-info-system)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/161698bdb1d44fe4a02c5b625c44e71a)](https://www.codacy.com/project/ryersonlibrary/building-info-system/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ryersonlibrary/building-info-system&amp;utm_campaign=Badge_Grade_Dashboard)

# @rula/building-info-system

RULA-BIS is an open source web application designed to provide directory,
wayfinding and other informational services for buildings using the latest web
technologies.

Currently the application contains a number of features:
 - __Mapping__: Display and navigate through floors of multiple buildings.  Map locations, rooms, service points and more.  Provide location information and
 wayfinding.
 - __FAQ__: Provide users with answers to often asked questions regarding building
 details or other services.
 - __Events__: Integrate any calendar in ICAL format and display upcoming events
 - __Building__ Details: Display and highlight information regarding one or more
 buildings.
 - __Search__: Look for specific entities of the above services.

## Installation

Currently the application is provided as a single bundle and can be installed by
either cloning this repo or by using NPM:

`git clone git@https://github.com/ryersonlibrary/building-info-system.git my-bis`

or

`npm i --save @rula/building-info-system`

## Requirements

The system fetches the information it needs from a number of external sources.
Primary among theses is a data API that provides all the details about most of
the aspects of the system (buildings, floors, and mapped elements, wayfinding,
images, FAQ text, and more).  This API needs to be setup configured separately.
The data specification that this application needs will be outlined below.
Other features like the events require an external ICAL file.

### Data API

There are a number of API enpoints that are used by the system. Each endpoint 
should provide `GET` functionality which, when called, returns a list of objects
in a JSON format. All the endpoints should be relative to a common host e.g. `api.example.com`.

The details of the API and the objects expected, along with their fields, will
be added later.
