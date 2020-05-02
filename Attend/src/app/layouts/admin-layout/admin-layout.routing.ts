import { Routes } from '@angular/router';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import {CoursesComponent} from '../../courses/courses.component';
import {VideotutorialsComponent} from '../../videotutorials/videotutorials.component';
import {DashboardComponent} from '../../dashboard/dashboard.component';
import {AttendanceComponent} from '../../attendance/attendance.component';
import {CaptureComponent} from '../../capture/capture.component';

export const AdminLayoutRoutes: Routes = [
    { path: '',   component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'courses',  component: CoursesComponent },
    { path: 'vtutorials',  component: VideotutorialsComponent },
    { path: 'attendance',  component: AttendanceComponent },
    { path: 'capture',  component: CaptureComponent },

];
