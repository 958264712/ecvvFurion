/* tslint:disable */
/* eslint-disable */
/**
 * Admin.NET
 * 让 .NET 开发更简单、更通用、更流行。前后端分离架构(.NET6/Vue3)，开箱即用紧随前沿技术。<br/><a href='https://gitee.com/zuohuaijun/Admin.NET/'>https://gitee.com/zuohuaijun/Admin.NET</a>
 *
 * OpenAPI spec version: 1.0.0
 * Contact: 515096995@qq.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { StatusEnum } from './status-enum';
import { SysOrg } from './sys-org';
/**
 * 
 * @export
 * @interface AddOrgInput
 */
export interface AddOrgInput {
    /**
     * 雪花Id
     * @type {number}
     * @memberof AddOrgInput
     */
    id?: number;
    /**
     * 创建时间
     * @type {Date}
     * @memberof AddOrgInput
     */
    createTime?: Date | null;
    /**
     * 更新时间
     * @type {Date}
     * @memberof AddOrgInput
     */
    updateTime?: Date | null;
    /**
     * 创建者Id
     * @type {number}
     * @memberof AddOrgInput
     */
    createUserId?: number | null;
    /**
     * 修改者Id
     * @type {number}
     * @memberof AddOrgInput
     */
    updateUserId?: number | null;
    /**
     * 软删除
     * @type {boolean}
     * @memberof AddOrgInput
     */
    isDelete?: boolean;
    /**
     * 租户Id
     * @type {number}
     * @memberof AddOrgInput
     */
    tenantId?: number | null;
    /**
     * 父Id
     * @type {number}
     * @memberof AddOrgInput
     */
    pid?: number;
    /**
     * 编码
     * @type {string}
     * @memberof AddOrgInput
     */
    code?: string | null;
    /**
     * 机构类型
     * @type {string}
     * @memberof AddOrgInput
     */
    orgType?: string | null;
    /**
     * 排序
     * @type {number}
     * @memberof AddOrgInput
     */
    orderNo?: number;
    /**
     * 备注
     * @type {string}
     * @memberof AddOrgInput
     */
    remark?: string | null;
    /**
     * 
     * @type {StatusEnum}
     * @memberof AddOrgInput
     */
    status?: StatusEnum;
    /**
     * 机构子项
     * @type {Array<SysOrg>}
     * @memberof AddOrgInput
     */
    children?: Array<SysOrg> | null;
    /**
     * 名称
     * @type {string}
     * @memberof AddOrgInput
     */
    name: string;
}
