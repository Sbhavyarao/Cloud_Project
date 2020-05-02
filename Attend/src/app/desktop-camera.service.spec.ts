import { TestBed } from '@angular/core/testing';

import { DesktopCameraService } from './desktop-camera.service';

describe('DesktopCameraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DesktopCameraService = TestBed.get(DesktopCameraService);
    expect(service).toBeTruthy();
  });
});
