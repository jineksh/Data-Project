"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight, Database, Code2, Sparkles, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans flex flex-col justify-between p-5 md:p-8">
      
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="font-bold text-base tracking-tight font-sans text-slate-100">
            DataGuard Engine
          </span>
        </div>
        <Link href="/dashboard">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 text-xs font-medium h-8">
            Launch Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center space-y-4 py-12">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1E293B] border border-slate-700/60 text-[11px] text-emerald-400 font-mono">
          <Sparkles className="h-3 w-3" /> PySpark & SQL Powered Quality Scanner
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-snug font-sans text-slate-100">
          Automated Data Validation for <span className="text-emerald-400">Modern Pipelines</span>
        </h1>

        <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
          Scan CSV and Parquet datasets automatically. Define SQL validation predicates and execute distributed quality audits seamlessly.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Link href="/dashboard">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium gap-1.5 h-9 px-5 text-xs">
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
        <Card className="bg-[#1E293B] border-slate-700/60">
          <CardContent className="p-4 space-y-2">
            <Database className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold text-sm text-slate-100 font-sans">Automatic File Discovery</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Scans storage directories and catalogs files in PostgreSQL via Prisma.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-slate-700/60">
          <CardContent className="p-4 space-y-2">
            <Code2 className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-sm text-slate-100 font-sans">SQL Predicate Rules</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Write standard SQL expressions for real-time dataset quality checks.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-slate-700/60">
          <CardContent className="p-4 space-y-2">
            <Cpu className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-sm text-slate-100 font-sans">PySpark Execution</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              High-performance distributed audit execution over large dataset volumes.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-500 pt-8 border-t border-slate-800 font-mono">
        Data Validation Platform • PostgreSQL + PySpark + Next.js
      </div>

    </div>
  );
}