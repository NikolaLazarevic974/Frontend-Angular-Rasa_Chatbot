import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AnimalService } from '../services/animal.service'; // Service for fetching animals
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AnimalComponent } from './animal/animal.component'; // Dialog for viewing animal details
import { Animal } from '../models/animal.model'; // Animal model
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit, AfterViewInit {
  animalSource = new MatTableDataSource<Animal>();
  displayedAnimals: Animal[] = [];
  selectedTypes: string[] = [];
  selectedSizes: string[] = [];
  searchTerm: string = '';
  selectedPrice: number = 0;
  minPrice: number = 0;
  maxPrice: number = 0;
  absoluteMaxPrice: number = 0;
  selectedSort: string = 'nameAsc';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('search') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChildren('checkbox') checkboxes!: QueryList<MatCheckbox>;

  types: string[] | undefined;
  sizes: string[] | undefined;

  constructor(private animalService: AnimalService, public dialog: MatDialog, public cartService: CartService) {}

  ngOnInit(): void {
    this.animalSource.data = this.animalService.getAnimals();
    this.displayedAnimals = this.animalSource.data;
    this.types = Array.from(new Set(this.animalSource.data.map(animal => animal.type))); // Extract unique species
    this.sizes = ["XS", "S", "M", "L", "XL"]; // Example sizes for animals

    const prices = this.animalSource.data.map(animal => animal.price);
    this.minPrice = Math.min(...prices);
    this.maxPrice = Math.max(...prices);
    this.absoluteMaxPrice = this.maxPrice;
    this.selectedPrice = this.maxPrice;

    this.animalSource.filterPredicate = (data: Animal, filter: string) => {
      const filterObj = JSON.parse(filter);
      const matchesSearch = data.name.toLowerCase().includes(filterObj.search.toLowerCase()) ||
                            data.species.toLowerCase().includes(filterObj.search.toLowerCase());
      const matchesType = filterObj.types.length === 0 || filterObj.types.includes(data.type.toLowerCase());
      const matchesSize = filterObj.sizes.length === 0 || filterObj.sizes.includes(data.sizes.toLowerCase());
      const matchesPrice = data.price <= filterObj.price;
      return matchesSearch && matchesType && matchesSize && matchesPrice;
    };

    const sortedData = this.sortData(this.animalService.getAnimals(), this.selectedSort);
    this.animalSource.data = sortedData;
    this.displayedAnimals = this.animalSource.data;
  }

  ngAfterViewInit(): void {
    this.animalSource.paginator = this.paginator;
    this.animalSource.connect().subscribe(data => {
      this.displayedAnimals = data;
    });
  }

  applyFilters() {
    const filterValue = JSON.stringify({
      search: this.searchTerm,
      types: this.selectedTypes,
      sizes: this.selectedSizes,
      price: this.selectedPrice
    });
    this.animalSource.filter = filterValue;

    if (this.animalSource.paginator) {
      this.animalSource.paginator.firstPage();
    }
  }

  onSpeciesChange(event: MatCheckboxChange, type: string) {
    if (event.checked) {
      this.selectedTypes.push(type.toLowerCase());
    } else {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type.toLowerCase());
    }
    this.applyFilters();
  }

  onTypeChange(event: MatCheckboxChange, type: string) {
    if (event.checked) {
      this.selectedTypes.push(type.toLowerCase());
    } else {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type.toLowerCase());
    }
    this.applyFilters();
  }

  onSizeChange(event: MatCheckboxChange, size: string) {
    if (event.checked) {
      this.selectedSizes.push(size.toLowerCase());
    } else {
      this.selectedSizes = this.selectedSizes.filter(s => s !== size.toLowerCase());
    }
    this.applyFilters();
  }

  onPriceChange(event: number) {
    this.selectedPrice = event;
    this.applyFilters();
  }

  resetFilters() {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.checkboxes.forEach(checkbox => checkbox.checked = false);
    this.selectedTypes = [];
    this.selectedSizes = [];
    this.searchTerm = '';
    this.selectedPrice = this.maxPrice;
    this.selectedSort = 'nameAsc';
    this.sortAnimals();
    this.applyFilters();
  }

  applyFilter(filterValue: string) {
    this.searchTerm = filterValue.trim().toLowerCase();
    this.applyFilters();
  }

  openAnimal(id: number) {
    const dialogRef = this.dialog.open(AnimalComponent, {
      width: '800px',
      height: '50vh',
      data: { animal: this.animalService.getAnimalById(id) }
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  addToCart(animal: Animal) {
    this.cartService.addToCart(animal);
    this.cartService.showMessage(`${animal.name} added to cart`, 'Great!');
  }

  sortData(animals: Animal[], sortOption: string): Animal[] {
    return animals.sort((a, b) => {
      switch (sortOption) {
        case 'nameAsc': return a.name.localeCompare(b.name);
        case 'nameDesc': return b.name.localeCompare(a.name);
        case 'priceAsc': return a.price - b.price;
        case 'priceDesc': return b.price - a.price;
        default: return 0;
      }
    });
  }

  sortAnimals(): void {
    const sortedData = this.sortData(this.animalSource.data, this.selectedSort);
    this.animalSource.data = sortedData;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  onPageChange(event: any) {
    window.scrollTo(0, 0);
    
  }

  getFullSize(size: string): string {
    switch(size) {
      case "XS":
        return "Very small";
      case 'S':
        return 'Small';
      case 'M':
        return 'Medium';
      case 'L':
        return 'Large';
      case 'XL':
        return 'Extra Large';
      default:
        return size; // Return the original if no match
    }
  }
}
