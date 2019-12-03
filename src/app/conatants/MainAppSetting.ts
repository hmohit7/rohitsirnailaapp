import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import * as jsonFile from '../conatants/organization.json';
import { Injectable } from '@angular/core';
import { StorageService } from '../common-services/storage-service.service.js';



const ORG = jsonFile.buildFor;
const appFor = jsonFile.connectTo;
@Injectable({
    providedIn: "root"
})
export class MainAppSetting {
    public ORG = ORG;
    public userId;
    public appFor = appFor;
    public storag = new Storage({})
    public token;
    public platform: string = '';

    constructor(
        private storageService: StorageService
    ) {
        this.storageService.getDatafromIonicStorage('token').then(data => {
            this.token = data
        })
        this.storageService.getDatafromIonicStorage('user_id').then(data => {
            this.userId = data
        })
        // this.storageService.getDatafromIonicStorage('platform').then(data => {
        //     this.platform = data
        // })
    }

    getPlatform(){
        this.storageService.getDatafromIonicStorage('platform').then(data => {
            this.token = data
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

    setPlatformAfterLogin(data: string) {
        console.log('Step 3 -------------recieved platform data', data);


        this.platform = data
        console.log('Step 3 ------------- setting platform', this.platform);
    }

    getHttpHeadesWithToken() {
        const httpHeadesWithToken = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': /**window.localStorage.getItem('token')*/ this.token
            })
        };
        return httpHeadesWithToken;
    }

    getApi() {

        console.log("Get api service called - step pre 7-------")
        this.storageService.getDatafromIonicStorage('platform').then(data => {
            console.log("value recieved in step 7 from storage", data);
            this.platform = data
        })

        let API = '';
        // console.log("pltform inapp setting " + this.platform);

        console.log("platform value in step post 7", this.platform)

        if (this.ORG == "Both") {
            if (window.localStorage.getItem('platform') == "rm") {
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
        } else if (this.ORG == "RM") {
            window.localStorage.setItem('appSrc', 'rentals');
            this.storageService.storeDataToIonicStorage('appSrc', 'rentals');

            if (this.appFor == 'alpha') {
                API = 'http://52.220.118.81:3020';
            } else if (this.appFor == 'production') {
                API = 'https://rentals.thehousemonk.com'
            }
        } else if (this.ORG == "BM") {
            window.localStorage.setItem('appSrc', 'building-management');
            this.storageService.storeDataToIonicStorage('appSrc', 'building-management');

            if (this.appFor == 'alpha') {
                API = 'https://alpha.thehousemonk.com';
            } else if (this.appFor == 'production') {
                API = 'https://thehousemonk.com';
            } else {
                API = 'http://localhost:3020';
            }
        }

        console.log('-------MAIN APP', API);
        return API;
    }




    // public API = API;
    public HTTPHEADER = this.getHttpHeades();
    // public static API = API;

}