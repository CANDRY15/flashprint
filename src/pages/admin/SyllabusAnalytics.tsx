import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, QrCode, TrendingUp } from "lucide-react";

interface SyllabusStats {
  id: string;
  title: string;
  views: number;
  downloads: number;
  qr_scans: number;
  total_interactions: number;
}

const SyllabusAnalytics = () => {
  const [stats, setStats] = useState<SyllabusStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    views: 0,
    downloads: 0,
    qr_scans: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: syllabusList, error: syllabusError } = await supabase
        .from('syllabus')
        .select('id, title')
        .order('title');

      if (syllabusError) throw syllabusError;

      const { data: analytics, error: analyticsError } = await supabase
        .from('syllabus_analytics')
        .select('syllabus_id, event_type');

      if (analyticsError) throw analyticsError;

      const syllabusStats: SyllabusStats[] = (syllabusList || []).map(syllabus => {
        const syllabusAnalytics = (analytics || []).filter(a => a.syllabus_id === syllabus.id);
        
        const views = syllabusAnalytics.filter(a => a.event_type === 'view').length;
        const downloads = syllabusAnalytics.filter(a => a.event_type === 'download').length;
        const qr_scans = syllabusAnalytics.filter(a => a.event_type === 'qr_scan').length;

        return {
          id: syllabus.id,
          title: syllabus.title,
          views,
          downloads,
          qr_scans,
          total_interactions: views + downloads + qr_scans,
        };
      });

      syllabusStats.sort((a, b) => b.total_interactions - a.total_interactions);
      setStats(syllabusStats);

      const totals = syllabusStats.reduce(
        (acc, curr) => ({
          views: acc.views + curr.views,
          downloads: acc.downloads + curr.downloads,
          qr_scans: acc.qr_scans + curr.qr_scans,
        }),
        { views: 0, downloads: 0, qr_scans: 0 }
      );

      setTotalStats(totals);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-poppins">Statistiques des Syllabus</h1>
        <p className="text-muted-foreground mt-2">
          Suivez les performances de vos syllabus
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Vues</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.views}</div>
            <p className="text-xs text-muted-foreground">Vues de pages syllabus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Téléchargements</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.downloads}</div>
            <p className="text-xs text-muted-foreground">Fichiers téléchargés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scans QR Code</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.qr_scans}</div>
            <p className="text-xs text-muted-foreground">Accès via QR code</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques par Syllabus</CardTitle>
          <CardDescription>Détail des interactions pour chaque syllabus</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" />
                    Vues
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Téléchargements
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <QrCode className="h-4 w-4" />
                    Scans QR
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Total
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Aucune statistique disponible
                  </TableCell>
                </TableRow>
              ) : (
                stats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell className="font-medium">{stat.title}</TableCell>
                    <TableCell className="text-center">{stat.views}</TableCell>
                    <TableCell className="text-center">{stat.downloads}</TableCell>
                    <TableCell className="text-center">{stat.qr_scans}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{stat.total_interactions}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SyllabusAnalytics;
