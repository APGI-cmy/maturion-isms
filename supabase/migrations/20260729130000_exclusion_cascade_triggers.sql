-- Foundational bootstrap: production-equivalent exclusion-cascade function and triggers.
-- Prerequisites: public.domains, public.mini_performance_standards, public.criteria (all must exist first).

create or replace function public.cascade_exclude_to_children()
returns trigger as $$
begin
  -- Cascade domain exclusion to child MPS rows
  if tg_table_name = 'domains' and old.excluded is distinct from new.excluded then
    update public.mini_performance_standards
       set excluded = new.excluded
     where domain_id = new.id;

    -- Also cascade to criteria directly under this domain
    update public.criteria
       set excluded = new.excluded
     where domain_id = new.id;
  end if;

  -- Cascade MPS exclusion to child criteria rows
  if tg_table_name = 'mini_performance_standards' and old.excluded is distinct from new.excluded then
    update public.criteria
       set excluded = new.excluded
     where mps_id = new.id;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger exclude_cascade_domains_trigger
  after update of excluded on public.domains
  for each row
  execute function public.cascade_exclude_to_children();

create trigger exclude_cascade_mps_trigger
  after update of excluded on public.mini_performance_standards
  for each row
  execute function public.cascade_exclude_to_children();
