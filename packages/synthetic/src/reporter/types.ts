export type ReporterConfig = {
    reportPrefixName: string;
    reportOutputPath: string;
    reportFormats: ReportFormats[];
}

export enum ReportFormats {
    html = 'html',
    json = 'json'
}
