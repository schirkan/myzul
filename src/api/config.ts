let server = window.location.protocol + '//' + window.location.hostname;
if (window.location.hostname === 'localhost') server += ':8000';

export const serverUrl = server;
