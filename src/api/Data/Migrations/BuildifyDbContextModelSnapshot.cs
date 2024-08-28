﻿// <auto-generated />
using System;
using System.Collections.Generic;
using System.Text.Json;
using TicketSystem.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TicketSystem.Api.Data.Migrations
{
    [DbContext(typeof(BuildifyDbContext))]
    partial class BuildifyDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Buildify.Api.Auth.Data.User", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(26)
                        .HasColumnType("character varying(26)");

                    b.Property<string>("Address")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Email")
                        .HasMaxLength(64)
                        .HasColumnType("character varying(64)");

                    b.Property<string>("ExternalId")
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<string>("LastName")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(24)
                        .HasColumnType("character varying(24)");

                    b.Property<int>("Role")
                        .HasColumnType("integer");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("character varying(64)");

                    b.HasKey("Id");

                    b.HasIndex("ExternalId");

                    b.HasIndex("Role");

                    b.HasIndex("Username");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Buildify.Api.Blogs.Data.Blog", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(26)
                        .HasColumnType("character varying(26)");

                    b.Property<string>("Content")
                        .HasColumnType("text");

                    b.Property<DateTime?>("CreationDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean");

                    b.Property<List<string>>("Image")
                        .HasColumnType("text[]");

                    b.Property<string>("Title")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasMaxLength(26)
                        .HasColumnType("character varying(26)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Blogs");
                });

            modelBuilder.Entity("Buildify.Api.Companies.Data.Company", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(26)
                        .HasColumnType("character varying(26)");

                    b.Property<string>("ActivatedById")
                        .HasMaxLength(26)
                        .HasColumnType("character varying(26)");

                    b.Property<DateTime?>("CreationDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean");

                    b.Property<bool>("HasBlog")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<bool>("IsDisabled")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SubDomain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasMaxLength(26)
                        .HasColumnType("character varying(26)");

                    b.Property<JsonDocument>("WebsiteConfiguration")
                        .HasColumnType("jsonb");

                    b.HasKey("Id");

                    b.HasIndex("ActivatedById");

                    b.HasIndex("SubDomain");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Companies");
                });

            modelBuilder.Entity("Buildify.Api.MediaFiles.Data.Media", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(26)
                        .HasColumnType("character varying(26)");

                    b.Property<string>("Extension")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Path")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("Size")
                        .HasColumnType("bigint");

                    b.Property<string>("UploaderId")
                        .HasMaxLength(26)
                        .HasColumnType("character varying(26)");

                    b.HasKey("Id");

                    b.HasIndex("UploaderId");

                    b.ToTable("Medias");
                });

            modelBuilder.Entity("Buildify.Api.Blogs.Data.Blog", b =>
                {
                    b.HasOne("Buildify.Api.Auth.Data.User", "User")
                        .WithMany("Blogs")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Buildify.Api.Companies.Data.Company", b =>
                {
                    b.HasOne("Buildify.Api.Auth.Data.User", "ActivatedBy")
                        .WithMany("ActivatedCompanies")
                        .HasForeignKey("ActivatedById");

                    b.HasOne("Buildify.Api.Auth.Data.User", "User")
                        .WithOne("Company")
                        .HasForeignKey("Buildify.Api.Companies.Data.Company", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsOne("Buildify.Api.Companies.Data.SubscriptionInfo", "SubscriptionInfo", b1 =>
                        {
                            b1.Property<string>("CompanyId")
                                .HasColumnType("character varying(26)");

                            b1.Property<string>("Note")
                                .HasColumnType("text");

                            b1.Property<int>("PaymentMethod")
                                .HasColumnType("integer");

                            b1.Property<decimal>("Price")
                                .HasColumnType("numeric");

                            b1.Property<DateTime?>("SubscriptionEndDate")
                                .HasColumnType("timestamp without time zone");

                            b1.Property<DateTime?>("SubscriptionStartDate")
                                .HasColumnType("timestamp without time zone");

                            b1.HasKey("CompanyId");

                            b1.ToTable("Companies");

                            b1.WithOwner()
                                .HasForeignKey("CompanyId");
                        });

                    b.Navigation("ActivatedBy");

                    b.Navigation("SubscriptionInfo")
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Buildify.Api.Auth.Data.User", b =>
                {
                    b.Navigation("ActivatedCompanies");

                    b.Navigation("Blogs");

                    b.Navigation("Company");
                });
#pragma warning restore 612, 618
        }
    }
}
