export function getSmartCityInfo() {
  return fetch("http://127.0.0.1:4523/m1/1652154-0-default/api/smartcity/info").then(response => response.json())
}

export function getSmartCityList() {
  return fetch("http://127.0.0.1:4523/m1/1652154-0-default/api/smartcity/list").then(response => response.json())
}
