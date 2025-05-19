// src/app/shared/ckeditor-wrapper.module.ts
import { NgModule } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  exports: [CKEditorModule]
})
export class CKEditorWrapperModule {}
