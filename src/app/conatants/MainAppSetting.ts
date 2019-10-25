import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import * as jsonFile from './organization.json'
import { StorageService } from '../common-services/storage-service.service.js';
import { Injectable } from '@angular/core';

const ORG = jsonFile.buildFor;
const appFor = jsonFile.connectTo;
@Injectable({
    providedIn: "root"
})
export class MainAppSetting {
    public userExistence = ORG;
    public storag = new Storage({})
    public token;
    public userId
    public platform;
    public appFor = appFor;

    constructor(
        private storageService: StorageService,
        private storage: Storage
    ) {
        this.storageService.getDatafromIonicStorage('token').then(data => {
            this.token = data
        })
        this.storageService.getDatafromIonicStorage('user').then(data => {
            this.userId = data
        })
        this.storageService.getDatafromIonicStorage('platform').then(data => {
            this.platform = data
        })

    }
    getHttpHeades() {
        const httpHeades = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        return httpHeades;
    }


    setTokenAferLogin(token) {
        this.token = token;
    }
    setPlatformAfterLogin(platform) {
        this.platform = platform
    }

    getHttpHeadesWithToken() {
        const httpHeadesWithToken = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': this.token//window.localStorage.getItem('token')
            })
        };
        return httpHeadesWithToken;
    }

    getApi() {

        let API = '';

        if (this.userExistence == "Both") {
            if (this.platform === 'rm') {
                if (this.appFor == 'alpha') {
                    API = 'http://52.220.118.81:3020';
                } else if (this.appFor == 'production') {
                    API = 'https://rentals.thehousemonk.com'
                }
            } else {
                if (this.appFor == 'alpha') {
                    API = 'https://alpha.thehousemonk.com';
                } else if (this.appFor == 'production') {
                    API = 'https://thehousemonk.com';
                }
            }
        } else if (this.userExistence == "RM") {
            window.localStorage.setItem('appSrc', 'rentals');
            this.storage.set('appSrc', 'rentals')
            this.storageService.storeDataToIonicStorage('appSrc', 'rentals');
            if (this.appFor == 'alpha') {
                API = 'http://52.220.118.81:3020';
            } else if (this.appFor == 'production') {
                API = 'https://rentals.thehousemonk.com'
            }
        } else if (this.userExistence == "BM") {
            window.localStorage.setItem('appSrc', 'building-management');
            this.storage.set('appSrc', 'building-management')
            if (this.appFor == 'alpha') {
                API = 'https://alpha.thehousemonk.com';
            } else if (this.appFor == 'production') {
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