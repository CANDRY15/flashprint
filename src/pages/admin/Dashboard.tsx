import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, BookOpen, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSyllabus: 0,
    totalFaculties: 0,
    popularSyllabus: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [syllabusRes, facultiesRes, popularRes] = await Promise.all([
      supabase.from('syllabus').select('id', { count: 'exact', head: true }),
      supabase.from('faculties').select('id', { count: 'exact', head: true }),
      supabase.from('syllabus').select('id', { count: 'exact', head: true }).eq('popular', true),
    ]);

    setStats({
      totalSyllabus: syllabusRes.count || 0,
      totalFaculties: facultiesRes.count || 0,
      popularSyllabus: popularRes.count || 0,
    });
  };

  const statCards = [
    {
      title: "Total Syllabus",
      value: stats.totalSyllabus,
      icon: FileText,
      description: "Syllabus disponibles",
      color: "text-blue-600",
    },
    {
      title: "Facultés",
      value: stats.totalFaculties,
      icon: BookOpen,
      description: "Facultés actives",
      color: "text-green-600",
    },
    {
      title: "Populaires",
      value: stats.popularSyllabus,
      icon: TrendingUp,
      description: "Syllabus populaires",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue dans votre espace administrateur</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Gérez rapidement votre contenu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • Ajoutez de nouveaux syllabus dans la section "Syllabus"
          </p>
          <p className="text-sm text-muted-foreground">
            • Gérez les facultés et leurs contenus
          </p>
          <p className="text-sm text-muted-foreground">
            • Marquez les syllabus populaires pour une meilleure visibilité
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
