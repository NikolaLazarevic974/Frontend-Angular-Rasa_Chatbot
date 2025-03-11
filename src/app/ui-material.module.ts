import { NgModule } from "@angular/core";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSliderModule} from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
    imports: [MatToolbarModule, MatButtonModule, MatFormFieldModule, MatCardModule, MatPaginatorModule, MatCheckboxModule, MatInputModule, 
        MatRadioModule, MatDividerModule, MatExpansionModule, MatSliderModule, MatIconModule, MatDialogModule, MatTableModule,
        MatSortModule, MatBadgeModule, MatSnackBarModule, MatSelectModule, MatDatepickerModule],
    exports: [MatToolbarModule, MatButtonModule, MatFormFieldModule, MatCardModule, MatPaginatorModule, MatCheckboxModule, MatInputModule, 
        MatRadioModule, MatDividerModule, MatExpansionModule, MatSliderModule, MatIconModule, MatDialogModule, MatTableModule,
        MatSortModule, MatBadgeModule, MatSnackBarModule, MatSelectModule, MatDatepickerModule]
})

export class MaterialModule { }