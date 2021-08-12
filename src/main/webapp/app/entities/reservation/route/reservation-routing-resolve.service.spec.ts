jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IReservation, Reservation } from '../reservation.model';
import { ReservationService } from '../service/reservation.service';

import { ReservationRoutingResolveService } from './reservation-routing-resolve.service';

describe('Service Tests', () => {
  describe('Reservation routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ReservationRoutingResolveService;
    let service: ReservationService;
    let resultReservation: IReservation | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ReservationRoutingResolveService);
      service = TestBed.inject(ReservationService);
      resultReservation = undefined;
    });

    describe('resolve', () => {
      it('should return IReservation returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReservation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultReservation).toEqual({ id: 123 });
      });

      it('should return new IReservation if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReservation = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultReservation).toEqual(new Reservation());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReservation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultReservation).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
