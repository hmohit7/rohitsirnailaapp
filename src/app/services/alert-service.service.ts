import { AppSettings } from 'src/app/conatants/appSettings';
import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx'


@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor(
    private alrtCtrl: AlertController,
    private camera: Camera,
    private transfer: FileTransfer,
    private appSetting: AppSettings
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

  public async capturePhoto() {
    await this.camera.getPicture(this.options).then((imageData) => {
      this.onCaptureImage(imageData)

    }, (error) => {
      console.error(error);
    });
    return this.fileURL;
  }

  private onCaptureImage(fileURI) {
    this.fileURL = fileURI.substring(7);
  }

  async presentAlert(header: string, subheader: string) {
    const alert = await this.alrtCtrl.create({
      header: header,
      subHeader: subheader,
      buttons: ['OK']
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
    }
    /** else if (type == 'CHECKIN') {


      this.apiUrl = `${this.appSetting.getApi()}/api/visitor-log/${data._id}`;
      uploadOpts.httpMethod = 'put';
      console.log(this.apiUrl, uploadOpts);

    } else if (type == 'STAFF') {
      this.apiUrl = `${this.appSetting.getApi()}/api/visitor-log`;
      uploadOpts.httpMethod = 'post';
      console.log(this.apiUrl, uploadOpts);
    } else {
      //wrong this.type
    }*/
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
