import React from 'react';
import Link from 'next/link';
import {
    FileText,
    FileJson,
    Database,
    HardDrive,
    ArrowRight,
} from 'lucide-react';

// Shadcn UI Components
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getFileMeta = (ext) => {
    const cleanExt = ext?.toLowerCase().replace('.', '');

    switch (cleanExt) {
        case 'csv':
            return {
                label: 'CSV',
                bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
                icon: FileText
            };
        case 'json':
            return {
                label: 'JSON',
                bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
                icon: FileJson
            };
        case 'parquet':
            return {
                label: 'PARQUET',
                bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20',
                icon: Database
            };
        default:
            return {
                label: cleanExt?.toUpperCase() || 'FILE',
                bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
                icon: HardDrive
            };
    }
};

export function DataSetCard({ dataset }) {
    const fileMeta = getFileMeta(dataset.ext);
    const FileIcon = fileMeta.icon;

    return (
        <Card className="group relative rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between">
            
            {/* Top Header: Icon + Name + Extension Badge */}
            <CardHeader className="p-0 space-y-0">
                <div className="flex items-start justify-between gap-2.5 mb-2">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                            <FileIcon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                            <h3 className="font-semibold text-foreground text-xs group-hover:text-primary transition-colors truncate font-sans" title={dataset.name}>
                                {dataset.baseName}
                            </h3>
                            <p className="font-mono text-[10px] text-muted-foreground truncate">
                                {dataset.name}
                            </p>
                        </div>
                    </div>

                    <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-mono font-semibold border ${fileMeta.bg}`}>
                        .{dataset.ext}
                    </Badge>
                </div>
            </CardHeader>

            {/* Middle/Bottom Meta Info */}
            <CardContent className="p-0 mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <div className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{dataset.sizeBytes}</span>
                </div>
            </CardContent>

            {/* Clickable Card Link (Detail Route) using Shadcn Button */}
            <CardFooter className="p-0 mt-3">
                <Button 
                    asChild 
                    variant="secondary" 
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 h-8 bg-secondary/50 hover:bg-primary hover:text-primary-foreground font-medium text-xs text-foreground transition-all duration-200"
                >
                    <Link href={`/dataset/${dataset.id}`}>
                        <span className="font-sans">Explore Dataset</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </Button>
            </CardFooter>
            
        </Card>
    );
}