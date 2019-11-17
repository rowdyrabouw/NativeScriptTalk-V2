import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { MipScanComponent } from "./mip-scan/mip-scan.component";
import { MipControllerComponent } from "./mip-controller/mip-controller.component";
import { LightControllerComponent } from "./light-controller/light-controller-component";
import { SpeechRecognition } from "nativescript-speech-recognition";

@NgModule({
    bootstrap: [AppComponent],
    imports: [NativeScriptModule, AppRoutingModule],
    declarations: [AppComponent, MipScanComponent, MipControllerComponent, LightControllerComponent],
    providers: [SpeechRecognition],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
