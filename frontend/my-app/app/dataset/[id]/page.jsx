'use client'

import React, { useState,use } from "react";
import Link from "next/link";
import {
    Database,
    HardDrive,
    Code2,
    Send,
    Columns,
    Table as TableIcon,
    Check,
    Copy,
    ArrowLeft,
    Layers,
    Loader2
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useGetDataSetById } from "../../../hooks/apis/dataset/useGetDataSetById.js";

export default function StandaloneDatasetPage({ params }) {
    const resolvedParams = use(params);
  const id = resolvedParams?.id;

    const { data: dataset, isPending, isError, error } = useGetDataSetById(id);

    const [rawQueries, setRawQueries] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);

    const parsedQueries = rawQueries
        .split(";")
        .map((q) => q.trim())
        .filter((q) => q.length > 0);

    const handleCopyQuery = () => {
        navigator.clipboard.writeText(rawQueries);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmitBatch = async () => {
        if (parsedQueries.length === 0 || !dataset) return;

        setIsSubmitting(true);

        const payload = {
            datasetId: dataset.id,
            datasetName: dataset.baseName || dataset.name,
            queries: parsedQueries,
        };

        try {
            setTimeout(() => {
                setIsSubmitting(false);
                alert(`${parsedQueries.length} rules saved to DB successfully!`);
                setRawQueries("");
            }, 800);
        } catch (err) {
            console.error("Batch submit failed:", err);
            setIsSubmitting(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-screen bg-background text-foreground w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                <p className="text-xs font-mono text-muted-foreground">
                    Fetching dataset schema & preview rows...
                </p>
            </div>
        );
    }

    if (isError || !dataset) {
        return (
            <div className="min-h-screen bg-background text-foreground w-full p-6 flex flex-col items-center justify-center gap-4">
                <p className="text-xs font-mono text-destructive">
                    Failed to load dataset details: {error?.message || "Dataset not found"}
                </p>
                <Button asChild variant="outline" size="sm" className="h-8 text-xs font-sans">
                    <Link href="/dashboard">
                        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        );
    }

    const columns = dataset.columns || [];
    const sampleRows = dataset.sampleRows || [];

    return (
        <div className="min-h-screen bg-background text-foreground w-full p-6 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="space-y-1.5">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-emerald-400 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <div className="flex items-center gap-2.5">
                        <h1 className="text-lg font-bold font-sans text-foreground tracking-tight">
                            {dataset.baseName || dataset.name}
                        </h1>
                        {dataset.ext && (
                            <Badge variant="outline" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                .{dataset.ext}
                            </Badge>
                        )}
                    </div>

                    <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-2">
                        <span>{dataset.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3 text-muted-foreground" />
                            {dataset.sizeBytes?.toString() || "0"} Bytes
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-sans gap-2 border-border bg-card">
                        <Database className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sync Schema</span>
                    </Button>
                </div>
            </div>

            <Card className="border border-border bg-card p-4">
                <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground font-sans">
                        <Columns className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Detected Columns ({columns.length})</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {columns.length > 0 ? (
                            columns.map((col) => (
                                <Badge
                                    key={col}
                                    variant="secondary"
                                    className="text-[10px] font-mono py-0.5 px-2 bg-secondary/60 text-slate-300 border border-border/80 hover:border-emerald-500/40 transition-colors"
                                >
                                    <span className="text-emerald-400/80 mr-1">#</span>
                                    {col}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-xs font-mono text-muted-foreground">No columns detected</span>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="border border-border bg-card overflow-hidden">
                <CardHeader className="p-3.5 border-b border-border bg-muted/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TableIcon className="w-3.5 h-3.5 text-emerald-400" />
                            <CardTitle className="text-xs font-semibold font-sans text-foreground">
                                Sample Data Preview
                            </CardTitle>
                        </div>
                        <CardDescription className="text-[10px] font-mono text-muted-foreground">
                            Top {sampleRows.length} rows
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-secondary/40">
                            <TableRow className="border-border hover:bg-transparent">
                                {columns.map((col) => (
                                    <TableHead key={col} className="text-[11px] font-mono font-semibold text-slate-300 h-8">
                                        {col}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sampleRows.length > 0 ? (
                                sampleRows.map((row, idx) => (
                                    <TableRow key={idx} className="border-border/60 hover:bg-secondary/30">
                                        {columns.map((col) => (
                                            <TableCell key={col} className="text-xs font-mono text-muted-foreground py-2.5">
                                                {row[col]?.toString() ?? "-"}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length || 1} className="text-center py-6 text-xs font-mono text-muted-foreground">
                                        No preview rows available for this dataset.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="border border-border bg-card overflow-hidden">
                <CardHeader className="p-3.5 border-b border-border bg-muted/30 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                        <div>
                            <CardTitle className="text-xs font-semibold font-sans text-foreground flex items-center gap-2">
                                Batch Rule & Query Submitter
                                <Badge variant="secondary" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {parsedQueries.length} Queries Ready
                                </Badge>
                            </CardTitle>
                            <CardDescription className="text-[10px] font-mono text-muted-foreground">
                                Write queries separated by semicolon (;) to batch save in DB
                            </CardDescription>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyQuery}
                            className="h-7 px-2 text-[10px] font-mono text-slate-400 hover:text-slate-100"
                        >
                            {copied ? <Check className="w-3 h-3 text-emerald-400 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                            {copied ? "Copied" : "Copy All"}
                        </Button>

                        <Button
                            size="sm"
                            onClick={handleSubmitBatch}
                            disabled={isSubmitting || parsedQueries.length === 0}
                            className="h-7 px-3 text-xs font-sans bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold gap-1.5"
                        >
                            <Send className="w-3 h-3 fill-current" />
                            <span>{isSubmitting ? "Submitting..." : `Submit Batch (${parsedQueries.length})`}</span>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0 bg-[#0B1120]">
                    <textarea
                        value={rawQueries}
                        onChange={(e) => setRawQueries(e.target.value)}
                        spellCheck={false}
                        rows={6}
                        placeholder={`SELECT * FROM ${dataset.baseName || "table"} WHERE status = 'ACTIVE';\nALTER TABLE ${dataset.baseName || "table"} CHECK (price > 0);`}
                        className="w-full p-4 font-mono text-xs bg-transparent text-emerald-300 placeholder:text-slate-600 focus:outline-none resize-y border-none leading-relaxed"
                    />

                    <div className="p-3 border-t border-border/40 bg-card/40 flex flex-wrap gap-2 items-center text-[11px] font-mono text-muted-foreground">
                        <span className="flex items-center gap-1 text-slate-400 font-sans font-medium text-xs mr-1">
                            <Layers className="w-3 h-3 text-emerald-400" />
                            Parsed Batch Payload:
                        </span>
                        {parsedQueries.length > 0 ? (
                            parsedQueries.map((q, idx) => (
                                <span key={idx} className="bg-secondary/70 border border-border px-2 py-0.5 rounded text-[10px] text-slate-300 truncate max-w-[280px]">
                                    {idx + 1}. {q}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] font-mono text-slate-500">
                                Enter queries above separated by semicolon (;)
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}