-- Create a public profiles table to store additional user information
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text default 'user',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Drop existing trigger and function if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create a trigger to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a secure function to update user profile
create or replace function public.update_user_profile(
  user_id uuid,
  new_full_name text,
  new_phone text
)
returns void
language plpgsql
security definer
as $$
begin
  -- Update the profiles table
  update public.profiles
  set 
    full_name = new_full_name,
    phone = new_phone,
    updated_at = now()
  where id = user_id;
  
  -- Update the user's metadata
  update auth.users
  set raw_user_meta_data = raw_user_meta_data || 
    jsonb_build_object(
      'full_name', new_full_name,
      'phone', new_phone
    )
  where id = user_id;
end;
$$;

-- Create a secure function to update user role
create or replace function public.update_user_role(
  user_id uuid,
  new_role text
)
returns void
language plpgsql
security definer
as $$
begin
  -- Update the profiles table
  update public.profiles
  set 
    role = new_role,
    updated_at = now()
  where id = user_id;
  
  -- Update the user's metadata
  update auth.users
  set raw_user_meta_data = raw_user_meta_data || 
    jsonb_build_object('role', new_role)
  where id = user_id;
end;
$$;

-- Create a secure function to toggle user active status
create or replace function public.toggle_user_status(
  user_id uuid,
  is_active boolean
)
returns void
language plpgsql
security definer
as $$
begin
  -- Update the profiles table
  update public.profiles
  set 
    is_active = is_active,
    updated_at = now()
  where id = user_id;
  
  -- Update the user's metadata
  update auth.users
  set raw_user_meta_data = raw_user_meta_data || 
    jsonb_build_object('is_active', is_active)
  where id = user_id;
end;
$$;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

-- Create policies for profile management
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on public.profiles to authenticated;
grant execute on function public.update_user_profile to authenticated;
grant execute on function public.update_user_role to authenticated;
grant execute on function public.toggle_user_status to authenticated; 