import { DataSetCard } from './DataSetCard.jsx';

export default function DataSetList({ datasets = [] }) {
    if (!datasets || datasets.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-border p-12 text-center bg-card/50">
                <p className="text-muted-foreground font-mono text-sm">
                    No datasets found in /data directory.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset) => (
                <DataSetCard key={dataset.id} dataset={dataset} />
            ))}
        </div>
    );
}