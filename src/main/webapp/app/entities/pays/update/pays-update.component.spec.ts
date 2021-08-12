jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PaysService } from '../service/pays.service';
import { IPays, Pays } from '../pays.model';

import { PaysUpdateComponent } from './pays-update.component';

describe('Component Tests', () => {
  describe('Pays Management Update Component', () => {
    let comp: PaysUpdateComponent;
    let fixture: ComponentFixture<PaysUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let paysService: PaysService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PaysUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PaysUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PaysUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      paysService = TestBed.inject(PaysService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const pays: IPays = { id: 456 };

        activatedRoute.data = of({ pays });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pays));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pays = { id: 123 };
        spyOn(paysService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pays });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pays }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(paysService.update).toHaveBeenCalledWith(pays);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pays = new Pays();
        spyOn(paysService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pays });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pays }));
        saveSubject.complete();

        // THEN
        expect(paysService.create).toHaveBeenCalledWith(pays);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pays = { id: 123 };
        spyOn(paysService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pays });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(paysService.update).toHaveBeenCalledWith(pays);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
