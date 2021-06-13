import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/user/user.model';

@Component({
    selector: 'app-UserList',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.css']
})

export class UserListComponent {
    @Input() userList=[];
    @Output() cancel = new EventEmitter<void>();
    @Output() onSelectUser = new EventEmitter<User>();   
    filterValue = "";

    onCancel() {
        this.cancel.emit();
    }

    onSelect(user: User) {
        this.onSelectUser.emit(user);
    }

}