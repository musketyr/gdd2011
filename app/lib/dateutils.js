/**
 * Copyright (C) 2008 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Converts an RFC3339 date time into local time JS Date.
// Returns null on error.
Date.prototype.parseRFC3339 = function(date) {
  // Parse date portion.
  // first 10 chars 'XXXX-XX-XX'
  var datePart = date.substring(0, 10);
  datePart = datePart.split("-");

  if (datePart.length != 3) {
    return null;
  }

  this.setUTCFullYear(datePart[0]);
  this.setUTCMonth(datePart[1] - 1);
  this.setUTCDate(datePart[2]);

  // Check for 'T'.
  var tPart = date.substring(10, 11);

  if (tPart != 'T' && tPart != 't') {
    return null;
  }

  // Parse time portion.
  // 'XX:XX:XX'
  var timePart = date.substring(11, 19);
  timePart = timePart.split(":");

  if (timePart.length != 3) {
    return null;
  }

  this.setUTCHours(timePart[0]);
  this.setUTCMinutes(timePart[1]);
  this.setUTCSeconds(timePart[2]);
  this.setUTCMilliseconds(0);
  
  var index = 19;
  var dateLen = date.length;

  if (date.charAt(index) == '.') {
    // Consume fractional sec.
    do {
      ++index;
    } while (date.charAt(index) >= '0' &&
             date.charAt(index) <= '9' &&
             index < date.length);
  }

  if (index >= date.length) {
    // No zone to parse;
    return this;
  }

  if (date.charAt(index) == 'Z') {
    // No offset.
    return this;
  }

  var offsetSign = date.charAt(index);

  if (offsetSign != '+' && offsetSign != '-') {
    return null;
  }

  ++index;

  // Parse offset.
  var offsetPart = date.substring(index, index + 5);

  if (offsetPart.length == 4) {
    // Assume colon-less format.
    var tempOffsetPart = [];
    tempOffsetPart[0] = offsetPart.substr(0, 2);
    tempOffsetPart[1] = offsetPart.substr(2, 2);
    offsetPart = tempOffsetPart;
  } else {
    offsetPart = offsetPart.split(":");
  }

  if (offsetPart.length != 2) {
    return null;
  }

  var offsetSeconds = (Number(offsetPart[0]) * 60) + Number(offsetPart[1]);
  var offsetMs = offsetSeconds * 60 * 1000;

  // Adjust for offset.
  if (offsetSign == '+') {
    this.setTime(this.getTime() - offsetMs);
  } else {
    this.setTime(this.getTime() + offsetMs);
  }

  return this;
}
