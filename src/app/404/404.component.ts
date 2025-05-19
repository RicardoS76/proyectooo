import { Component, OnInit} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
selector:'app-404',
templateUrl: './404.component.html',
styleUrls: ['./404.component.css']

})
export class ErrorComponent implements OnInit {
    constructor(
        private spinner:NgxSpinnerService
    ){

    }
    ngOnInit() {
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }

    }
