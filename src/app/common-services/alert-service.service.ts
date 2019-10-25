import { AlertController, ActionSheetController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx'
import { MainAppSetting } from '../conatants/MainAppSetting';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor(
    private alrtCtrl: AlertController,
    private camera: Camera,
    private transfer: FileTransfer,
    private appSetting: MainAppSetting,
    private actionSheet: ActionSheetController,
    private storage: Storage
  ) { }

  public data: any = {};
  public respData: any = {};
  public fileURL: any;
  public apiUrl: any;

  private options: CameraOptions = {
    quality: 15,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
  }


  saveToLocalStorage(key, value) {
    this.storage.set(key, value);
  }

  getDataFromLoaclStorage(key) {
    return this.storage.get(key)
  }

  async presentActionSheet() {
    const actionsheet = await this.actionSheet.create({
      header: 'Select Choice',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: async () => {
          }
        },
        {
          text: 'phone',
          icon: 'phone-portrait',
          handler: () => {
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          handler: () => {
            console.log('cancel');
          }
        }
      ]
    })
    return await actionsheet.present();
  }

  async capturePhoto() {
    // await this.presentActionSheet();
    await this.camera.getPicture(this.options).then((imageData) => {
      console.log("image data by camera", imageData);
      this.fileURL = this.onCaptureImage(imageData);
    }, (error) => {
      console.error(error);
    });
    return this.fileURL;
  }

  private onCaptureImage(fileURI) {
    console.log("from on capture image", fileURI);
    return fileURI.substring(7);
  }

  async presentAlert(header: string, subheader: string) {
    const alert = await this.alrtCtrl.create({
      header: header,
      subHeader: subheader,
      cssClass: 'alert-header',
      buttons: [{
        text: 'OK',
        cssClass: 'alert-button'
      }]
    });
    await alert.present();
  }

  public async upload(fileURI1, data, type) {
    console.log(data);
    const fileTransfer: FileTransferObject = this.transfer.create();

    const uploadOpts: FileUploadOptions = {
      fileKey: "Display Picture",
      params: {
        data: JSON.stringify(data)
      },
      fileName: fileURI1.substr(fileURI1.lastIndexOf('/') + 1),
      headers: {
        'authorization': window.localStorage.getItem('token'),
      },
    }

    if (type == 'RAISETICKET') {
      this.apiUrl = `${this.appSetting.getApi()}/api/ticket`;
      uploadOpts.httpMethod = 'post';
      console.log(this.apiUrl, uploadOpts);
    } else if (type == 'UPDATETICKET') {
      uploadOpts.httpMethod = 'put';
      this.apiUrl = `${this.appSetting.getApi()}/api/ticket/${data._id}`
      console.log(this.apiUrl, uploadOpts);
    } else if (type == 'CREATENOTICE') {
      uploadOpts.httpMethod = 'post';
      this.apiUrl = `${this.appSetting.getApi()}/api/discussion`;
      console.log(this.apiUrl, uploadOpts);
    } else if (type == 'ADDTOTICKETDETAIL') {
      this.apiUrl = `${this.appSetting.getApi()}/api/ticket/${data._id}`;
      uploadOpts.httpMethod = 'put';
      console.log(this.apiUrl, uploadOpts);

    }
    console.log(uploadOpts);

    await fileTransfer.upload(fileURI1, this.apiUrl, uploadOpts).then((data) => {
      this.respData = JSON.parse(data.response);
      console.log(this.respData);
      this.fileURL = this.respData.fileUrl;
      return data
    }, (err) => {
      console.log(err);

    })
    console.log("Before Returning data", this.respData);
    return this.respData
  }
}
