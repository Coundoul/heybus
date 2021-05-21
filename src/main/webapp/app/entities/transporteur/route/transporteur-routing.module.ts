import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TransporteurComponent } from '../list/transporteur.component';
import { TransporteurDetailComponent } from '../detail/transporteur-detail.component';
import { TransporteurUpdateComponent } from '../update/transporteur-update.component';
import { TransporteurRoutingResolveService } from './transporteur-routing-resolve.service';

const transporteurRoute: Routes = [
  {
    path: '',
    component: TransporteurComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TransporteurDetailComponent,
    resolve: {
      transporteur: TransporteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TransporteurUpdateComponent,
    resolve: {
      transporteur: TransporteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TransporteurUpdateComponent,
    resolve: {
      transporteur: TransporteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(transporteurRoute)],
  exports: [RouterModule],
})
export class TransporteurRoutingModule {}
