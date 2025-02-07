import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column({unique: true})
    username: string;
    @Column({unique: true})
    mobile: string;
    @Column({default: false})
    mobile_verified: boolean;
    @Column()
    first_name: string;
    @Column()
    last_name: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @Column()
    otpId: number;
    @OneToOne(()=> OtpEntity, otp => otp.user)
    @JoinColumn({name: "otpId"})
    otp: OtpEntity
}
