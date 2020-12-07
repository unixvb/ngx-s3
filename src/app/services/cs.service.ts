import * as CloudSearchDomain from 'aws-sdk/clients/cloudsearchdomain';
import {Injectable} from '@angular/core';
import {csConfig} from '../../config/cs';
import {S3ObjectsService} from './s3-objects.service';
import {Lambda} from 'aws-sdk';
import {SearchResponse} from 'aws-sdk/clients/cloudsearchdomain';
import {CsIndexField} from '../models/enums/cs-index-fields.enum';

const hashCode = (str) => {
    return Array.from(str)
        .reduce((s: number, c: string) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0).toString();
};

const csd = new CloudSearchDomain({
    endpoint: csConfig.CsName + '.' + csConfig.ServiceRegion + '.cloudsearch.amazonaws.com',
    region: csConfig.ServiceRegion,
    apiVersion: '2013-01-01'
});

const getPullParams = (FunctionName: string, payload: object) => ({
    FunctionName,
    InvocationType: 'RequestResponse',
    LogType: 'None',
    Payload: JSON.stringify(payload)
});


@Injectable({providedIn: 'root'})
export class CsService {

    addToIndex(file: File, file_folder: string, author_email: string, file_tags: string[]) {
        const lambda = new Lambda({region: csConfig.ServiceRegion, apiVersion: '2015-03-31'});

        lambda.invoke(getPullParams('docIndexer', [{
            type: 'add',
            id: hashCode(S3ObjectsService.generateKey(file_folder, file.name)),
            fields: {
                author_email,
                file_folder,
                file_tags,
                file_name: file.name,
                file_size: file.size,
                file_type: file.type,
                created_at_iso_string: new Date().toISOString()
            }
        }]), function (error, data) {
            if (error) {
                console.log(error);
            } else {
                const response = JSON.parse(data.Payload.toString());
                console.log(response);
            }
        });
    }

    deleteFromIndex(Key: string) {
        const lambda = new Lambda({region: csConfig.ServiceRegion, apiVersion: '2015-03-31'});

        lambda.invoke(getPullParams('docIndexer', [{
            type: 'delete',
            id: hashCode(Key)
        }]), function (error, data) {
            if (error) {
                console.log(error);
            } else {
                const response = JSON.parse(data.Payload.toString());
                console.log(response);
            }
        });
    }

    search(searchPayload: object, callback: (error, list: Record<CsIndexField, string>[]) => void) {
        const lambda = new Lambda({region: csConfig.ServiceRegion, apiVersion: '2015-03-31'});

        lambda.invoke(getPullParams('docSearcher', searchPayload), function (error, data) {
            if (error) {
                console.log(error);
                callback(error, []);
            } else {
                const response: SearchResponse = JSON.parse(data.Payload.toString());

                callback(null, response.hits.hit.map(({fields}) => (fields)) as unknown as Record<CsIndexField, string>[]);
            }
        });
    }
}
