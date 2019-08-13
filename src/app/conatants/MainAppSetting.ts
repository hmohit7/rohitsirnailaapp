import { HttpHeaders } from '@angular/common/http';

// const API = "https://alpha.thehousemonk.com";
// const API = "https://thehousemonk.com";

export class MainAppSetting {
    public userExistence = "BM";
    getHttpHeades() {
        const httpHeades = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        return httpHeades;
    }

    getHttpHeadesWithToken() {
        const httpHeadesWithToken = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': window.localStorage.getItem('token')
            })
        };
        return httpHeadesWithToken;
    }
    getApi() {

        let API = '';

        if (this.userExistence == "Both") {
            if (window.localStorage.getItem('platform') === 'rm') {
                if (window.localStorage.getItem('appFor') == 'alpha') {
                    API = 'http://52.220.118.81:3020';
                } else if (window.localStorage.getItem('appFor') == 'production') {
                    API = 'https://rentals.thehousemonk.com'
                }
            } else {
                if (window.localStorage.getItem('appFor') == 'alpha') {
                    API = 'https://alpha.thehousemonk.com';
                } else if (window.localStorage.getItem('appFor') == 'production') {
                    API = 'https://thehousemonk.com';
                }
            }
        } else if (this.userExistence == "RM") {
            if (window.localStorage.getItem('appFor') == 'alpha') {
                API = 'http://52.220.118.81:3020';
            } else if (window.localStorage.getItem('appFor') == 'production') {
                API = 'https://rentals.thehousemonk.com'
            }
        } else if (this.userExistence == "BM") {
            if (window.localStorage.getItem('appFor') == 'alpha') {
                API = 'https://alpha.thehousemonk.com';
            } else if (window.localStorage.getItem('appFor') == 'production') {
                API = 'https://thehousemonk.com';
            }
        }

        console.log('-------MAIN APP', API);
        return API;
    }

    // public API = API;
    public HTTPHEADER = this.getHttpHeades();
    // public HTTPHEADERWITHTOKEN = this.getHttpHeadesWithToken();

}