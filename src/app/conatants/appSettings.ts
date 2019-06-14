// const API = "http://localhost:3020";
// const API = "http://52.220.118.81";
// const API = "http://13.229.166.29";

const RMAPI = 'http://52.220.118.81:3020';
const BMAPI = 'https://alpha.thehousemonk.com';

const TOKEN = window.localStorage.getItem('token');
const USER = window.localStorage.getItem('userId');

export class AppSettings {
    public static BMAPI = BMAPI;
    public static RMAPI = RMAPI;
    public static TOKEN = TOKEN;
    public static USER = USER;
};