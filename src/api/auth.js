import {fetchJSON} from '../util'

export function requestAccessToken({oauth, serviceRoot, tenantId, clientId, clientSecret}) {
	const url = `${oauth}/${tenantId}/oauth2/token`
	const body = `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&resource=${encodeURIComponent(serviceRoot)}`

	return fetchJSON(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json',
		},
		body,
	})
}
